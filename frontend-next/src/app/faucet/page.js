"use client";

import { useState } from "react";

const Faucet = () => {
  const [address, setAddress] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState('');
  const [recentClaim, setRecentClaim] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    setIsValid(ethAddressRegex.test(value));
  };

  const handleFaucetRequest = async () => {
    if (!isValid) return;

    setLoading(true);
    setMessage('');
    setRecentClaim('');

    try {
      const response = await fetch('http://localhost:43000/api/faucet/drip/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Токены успешно отправлены! TxHash: ${data.txHash}`);
      } else {
        if (data.error.includes('Wait')) {
          setRecentClaim(data.error);
        } else {
          setMessage(`Ошибка: ${data.error}`);
        }
      }
    } catch (err) {
      setMessage('Ошибка сети или сервера');
    }

    setLoading(false);
  };

  return (
    <div className="faucet-container max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Faucet</h2>

      <label className="block mb-2">Введите адрес:</label>
      <input
        type="text"
        value={address}
        onChange={handleChange}
        placeholder="0x..."
        className="faucet-input border rounded w-full p-2 mb-2"
      />

      {!isValid && address && <p className="text-red-600 mb-2">Неверный адрес</p>}

      <button
        onClick={handleFaucetRequest}
        disabled={!isValid || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Отправка...' : 'Запросить токены'}
      </button>

      {message && <p className="text-green-600 mt-4">{message}</p>}

      {recentClaim && <p className="text-yellow-600 mt-4">{recentClaim}</p>}
    </div>
  );
};

export default Faucet;
