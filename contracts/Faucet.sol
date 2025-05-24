// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract Faucet {
    address public owner;
    IERC20 public tokenCL;
    IERC20 public tokenFUSDT;

    uint256 public amountA = 1000 * 10**18;
    uint256 public amountB = 1000 * 10**18;
    /// @notice 
    mapping(address => uint256) public lastRequest;

    uint256 public cooldown = 1 days;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _tokenA, address _tokenB) {
        owner = msg.sender;
        tokenCL = IERC20(_tokenA);
        tokenFUSDT = IERC20(_tokenB);
    }

    function requestTokens(address recipient) external {
        require(block.timestamp - lastRequest[recipient] >= cooldown, "Wait 24h");
        lastRequest[recipient] = block.timestamp;

        require(tokenCL.transfer(recipient, amountA), "Token A transfer failed");
        require(tokenFUSDT.transfer(recipient, amountB), "Token B transfer failed");
    }

    // Админка

    function updateAmounts(uint256 _amountA, uint256 _amountB) external onlyOwner {
        amountA = _amountA;
        amountB = _amountB;
    }

    function updateCooldown(uint256 _cooldown) external onlyOwner {
        cooldown = _cooldown;
    }

    function updateTokens(address _tokenA, address _tokenB) external onlyOwner {
        tokenCL = IERC20(_tokenA);
        tokenFUSDT = IERC20(_tokenB);
    }

    function withdrawTokens(address _to, uint256 amountA_, uint256 amountB_) external onlyOwner {
        require(tokenCL.transfer(_to, amountA_), "Withdraw A failed");
        require(tokenFUSDT.transfer(_to, amountB_), "Withdraw B failed");
    }

    function timeUntilNextClaim(address user) external view returns (uint256) {
    if (block.timestamp >= lastRequest[user] + cooldown) {
        return 0;
    } else {
        return (lastRequest[user] + cooldown) - block.timestamp;
    }
}
}
