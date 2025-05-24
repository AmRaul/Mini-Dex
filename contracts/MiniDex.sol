// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";



// ============ LP Token 
contract LPToken is ERC20, ReentrancyGuard, Ownable {
    constructor(address initialOwner) ERC20("MiniDEX LP", "MLP") Ownable(initialOwner) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
// ============ MINI DEX

contract MiniDex is Ownable, ReentrancyGuard {
    IERC20 public tokenA; // CL token
    IERC20 public tokenB; // fUSDT token 
    LPToken public lpToken; // LP token

    uint256 public reserveA;
    uint256 public reserveB;

    event LiquidityAdded(address indexed user, uint256 amountA, uint256 amountB);
    event LiquidityRemoved(address indexed user, uint256 amountA, uint256 amountB);
    event Swapped(address indexed user, address tokenIn, uint256 amountIn, uint256 amountOut);

    constructor(address _tokenA, address _tokenB, address _initialOwner)
        Ownable(_initialOwner) 
    {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        lpToken = new LPToken(address(this));
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external nonReentrant {
        require(amountA > 0 && amountB > 0, "Invalid amounts");

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        
        uint256 totalSupplyLP = lpToken.totalSupply();
        uint256 liquidity;
        if (totalSupplyLP == 0) {
            liquidity = amountA + amountB;
        } else {
            liquidity = min(
                (amountA * totalSupplyLP) / reserveA,
                (amountB * totalSupplyLP) / reserveB
            );
        }

        lpToken.mint(msg.sender, liquidity);

        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    // Remove liquidity 
    function removeLiquidity(uint256 liquidity) external nonReentrant {
        require(liquidity > 0, "Invalid liquidity amount");
        require(lpToken.balanceOf(msg.sender) >= liquidity, "Insufficient liquidity");

        uint256 totalSupplyLP = lpToken.totalSupply();

        // Calculate the amount of tokenA and tokenB to return
        uint256 amountA = (liquidity * reserveA) / totalSupplyLP;
        uint256 amountB = (liquidity * reserveB) / totalSupplyLP;

        lpToken.burn(msg.sender, liquidity);

        // Update reserves
        reserveA -= amountA;
        reserveB -= amountB;

        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);


        emit LiquidityRemoved(msg.sender, amountA, amountB);


    }

    function swap(address tokenIn, uint256 amountIn) external nonReentrant {
        require(tokenIn == address(tokenA) || tokenIn == address(tokenB), "Unsupported token");
        require(amountIn > 0, "Invalid amount");

        bool isTokenAIn = tokenIn == address(tokenA);
        IERC20 inToken = isTokenAIn ? tokenA : tokenB;
        IERC20 outToken = isTokenAIn ? tokenB : tokenA;

        uint256 reserveIn = isTokenAIn ? reserveA : reserveB;
        uint256 reserveOut = isTokenAIn ? reserveB : reserveA;

        inToken.transferFrom(msg.sender, address(this), amountIn);

        uint256 amountInWithFee = (amountIn * 997) / 1000;
        uint256 amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);

        require(amountOut > 0, "Insufficient output");

        outToken.transfer(msg.sender, amountOut);

        // Обновляем резервы
        if (isTokenAIn) {
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
        }

        emit Swapped(msg.sender, tokenIn, amountIn, amountOut);
    }

        // Добавляем getter для reserveA
    function getReserveA() public view returns (uint256) {
        return reserveA;
    }

    // Добавляем getter для reserveB
    function getReserveB() public view returns (uint256) {
        return reserveB;
    }
}
