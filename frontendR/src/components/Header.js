import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import WalletModal from "./modalConnect";

const Header = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const connectMetaMask = async () => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      alert("Пожалуйста, установите MetaMask!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Ошибка подключения MetaMask");
    }
  };

  const handleWalletSelect = (wallet) => {
    if (wallet === "metamask") {
      connectMetaMask();
    }
  };

  return (
    <header className="header flex items-center justify-between p-4 bg-gray-900 text-white">
      <div className="logo font-bold text-xl">MiniDEX</div>

      <nav className="nav space-x-4">
        <NavLink to="/" className="nav-link hover:underline">Main</NavLink>
        <NavLink to="/trade" className="nav-link hover:underline">Trade</NavLink>
        <NavLink to="/faucet" className="nav-link hover:underline">Faucet</NavLink>
        <NavLink to="/liquidity" className="nav-link hover:underline">Liquidity</NavLink>
      </nav>

      <div>
        {walletAddress ? (
          <div className="bg-gray-800 px-3 py-1 rounded">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Connect Wallet
          </button>
        )}
      </div>

      <WalletModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleWalletSelect}
      />
    </header>
  );
};

export default Header;
