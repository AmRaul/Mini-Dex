import React, { useState } from 'react';

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
        // если пришла ошибка от сервера
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
    <div className="faucet-container">
      <h2>Faucet</h2>

      <label>Введите адрес:</label>
      <input
        type="text"
        value={address}
        onChange={handleChange}
        placeholder="0x..."
        className="faucet-input"
      />

      {!isValid && address && <p className="error">Неверный адрес</p>}

      <button onClick={handleFaucetRequest} disabled={!isValid || loading}>
        {loading ? 'Отправка...' : 'Запросить токены'}
      </button>

      {message && <p className="success">{message}</p>}

      {recentClaim && <p className="warning">{recentClaim}</p>}
    </div>
  );
};

export default Faucet;
