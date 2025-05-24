// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CLToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    /// @notice Максимальное количество токенов, которое может быть выпущено
    uint256 public immutable maxSupply;

    /// @notice Событие, вызываемое при выпуске новых токенов
    event Minted(address indexed to, uint256 amount);

    constructor(
        address recipient, 
        address initialOwner, 
        uint256 _initialMint, 
        uint256 _maxSupply
    )
        ERC20("TheCryptoLogs", "CL")
        Ownable(initialOwner)
        ERC20Permit("TheCryptoLogs")
    {
        maxSupply = _maxSupply;
        mint(recipient, _initialMint);
    }

    /// @notice Выпуск токенов (только владелец)
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= maxSupply, "Max supply exceeded");
        _mint(to, amount);
        emit Minted(to, amount);
    }
}
