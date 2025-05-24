// ConnectWallet.js
import React, { useState } from "react";
import { BrowserProvider } from "ethers";
import Web3Modal from "web3modal";

const ConnectWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new BrowserProvider(connection);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    } catch (error) {
      console.error("Ошибка при подключении кошелька:", error);
    }
  };

  return (
    <button onClick={connectWallet} className="connect-btn">
      {walletAddress ? (
        <span>🟢 {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
};

export default ConnectWallet;
