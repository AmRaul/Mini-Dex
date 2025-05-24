import React, { useState, useEffect } from "react";

export default function Trade() {
  const [selectedTokenA, setSelectedTokenA] = useState("CL");
  const [selectedTokenB, setSelectedTokenB] = useState("FUSDT");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [price, setPrice] = useState(2.2);
  const [gasFee, setGasFee] = useState(null);

  useEffect(() => {
    setGasFee({ eth: 0.0005, usd: 1.25 });
  }, []);

  // Обновить курс (можно расширить при реальном использовании)
  const updatePrice = (tokenA, tokenB) => {
    if (tokenA === "CL" && tokenB === "FUSDT") {
      setPrice(2.2);
    } else if (tokenA === "FUSDT" && tokenB === "CL") {
      setPrice(1 / 2.2);
    }
  };

  useEffect(() => {
    if (amountA && price) {
      setAmountB((amountA * price).toFixed(4));
    }
  }, [price]);

  const handleTokenAChange = (e) => {
    const newTokenA = e.target.value;
    if (newTokenA === selectedTokenB) {
      // Меняем местами
      setSelectedTokenA(selectedTokenB);
      setSelectedTokenB(selectedTokenA);
    } else {
      setSelectedTokenA(newTokenA);
    }
  };

  const handleTokenBChange = (e) => {
    const newTokenB = e.target.value;
    if (newTokenB === selectedTokenA) {
      setSelectedTokenA(selectedTokenB);
      setSelectedTokenB(selectedTokenA);
    } else {
      setSelectedTokenB(newTokenB);
    }
  };

  useEffect(() => {
    updatePrice(selectedTokenA, selectedTokenB);
  }, [selectedTokenA, selectedTokenB]);

  const handleAmountAChange = (e) => {
    const value = e.target.value;
    setAmountA(value);
    if (price) {
      setAmountB((value * price).toFixed(4));
    }
  };

  const handleAmountBChange = (e) => {
    const value = e.target.value;
    setAmountB(value);
    if (price) {
      setAmountA((value / price).toFixed(4));
    }
  };

  return (
    <div className="trade-container">
      <h2>Trade Your Tokens</h2>
      <p className="trade-description">
        Обменяйте свои токены с минимальными комиссиями и высокой скоростью!
      </p>

      <div className="token-selection">
        <div className="select-token">
          <label htmlFor="tokenA">Token A</label>
          <select id="tokenA" value={selectedTokenA} onChange={handleTokenAChange}>
            <option value="CL">CL</option>
            <option value="FUSDT">FUSDT</option>
          </select>
        </div>

        <div className="select-token">
          <label htmlFor="tokenB">Token B</label>
          <select id="tokenB" value={selectedTokenB} onChange={handleTokenBChange}>
            <option value="CL">CL</option>
            <option value="FUSDT">FUSDT</option>
          </select>
        </div>

        <div className="amount-input">
          <label htmlFor="amountA">{selectedTokenA} Amount</label>
          <input
            type="number"
            id="amountA"
            value={amountA}
            onChange={handleAmountAChange}
            placeholder="Enter amount"
          />
        </div>

        <div className="amount-input">
          <label htmlFor="amountB">{selectedTokenB} Amount</label>
          <input
            type="number"
            id="amountB"
            value={amountB}
            onChange={handleAmountBChange}
            placeholder="Calculated amount"
          />
        </div>

        <button className="swap-button" onClick={() => alert("Swap functionality coming soon!")}>
            Swap
        </button>


        <div className="price-display">
          <p>1 {selectedTokenA} = {price} {selectedTokenB}</p>
        </div>
      </div>

      {gasFee && (
        <div className="gas-fee-display">
          <h3>Gas Fee</h3>
          <p>{gasFee.eth} ETH (~${gasFee.usd})</p>
        </div>
      )}
    </div>
  );
}
