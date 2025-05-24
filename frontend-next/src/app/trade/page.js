"use client";

import { useState, useEffect } from "react";

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

  const updatePrice = (tokenA, tokenB) => {
    if (tokenA === "CL" && tokenB === "FUSDT") {
      setPrice(2.2);
    } else if (tokenA === "FUSDT" && tokenB === "CL") {
      setPrice(1 / 2.2);
    } else {
      setPrice(1);
    }
  };

  // Обновляем цену при смене токенов
  useEffect(() => {
    updatePrice(selectedTokenA, selectedTokenB);
  }, [selectedTokenA, selectedTokenB]);

  // Обновляем amountB при изменении amountA или цены
  useEffect(() => {
    if (amountA && price) {
      setAmountB((amountA * price).toFixed(4));
    } else {
      setAmountB("");
    }
  }, [amountA, price]);

  const handleTokenAChange = (e) => {
    const newTokenA = e.target.value;
    if (newTokenA === selectedTokenB) {
      setSelectedTokenA(selectedTokenB);
      setSelectedTokenB(selectedTokenA);
    } else {
      setSelectedTokenA(newTokenA);
    }
    setAmountA("");
    setAmountB("");
  };

  const handleTokenBChange = (e) => {
    const newTokenB = e.target.value;
    if (newTokenB === selectedTokenA) {
      setSelectedTokenA(selectedTokenB);
      setSelectedTokenB(selectedTokenA);
    } else {
      setSelectedTokenB(newTokenB);
    }
    setAmountA("");
    setAmountB("");
  };

  const handleAmountAChange = (e) => {
    const value = e.target.value;
    setAmountA(value);
  };

  const handleAmountBChange = (e) => {
    const value = e.target.value;
    setAmountB(value);
    if (price) {
      setAmountA((value / price).toFixed(4));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Trade Your Tokens</h2>
      <p className="mb-6 text-gray-600">
        Обменяйте свои токены с минимальными комиссиями и высокой скоростью!
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="tokenA" className="block mb-1 font-medium">Token A</label>
          <select
            id="tokenA"
            value={selectedTokenA}
            onChange={handleTokenAChange}
            className="w-full border p-2 rounded"
          >
            <option value="CL">CL</option>
            <option value="FUSDT">FUSDT</option>
          </select>
        </div>

        <div>
          <label htmlFor="tokenB" className="block mb-1 font-medium">Token B</label>
          <select
            id="tokenB"
            value={selectedTokenB}
            onChange={handleTokenBChange}
            className="w-full border p-2 rounded"
          >
            <option value="CL">CL</option>
            <option value="FUSDT">FUSDT</option>
          </select>
        </div>

        <div>
          <label htmlFor="amountA" className="block mb-1 font-medium">{selectedTokenA} Amount</label>
          <input
            type="number"
            id="amountA"
            value={amountA}
            onChange={handleAmountAChange}
            placeholder="Enter amount"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="amountB" className="block mb-1 font-medium">{selectedTokenB} Amount</label>
          <input
            type="number"
            id="amountB"
            value={amountB}
            onChange={handleAmountBChange}
            placeholder="Calculated amount"
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={() => alert("Swap functionality coming soon!")}
          disabled={!amountA || !amountB}
        >
          Swap
        </button>

        <div className="mt-4 text-center text-gray-700">
          <p>1 {selectedTokenA} = {price.toFixed(4)} {selectedTokenB}</p>
        </div>

        {gasFee && (
          <div className="mt-6 p-4 bg-gray-100 rounded text-center">
            <h3 className="font-semibold mb-2">Gas Fee</h3>
            <p>{gasFee.eth} ETH (~${gasFee.usd})</p>
          </div>
        )}
      </div>
    </div>
  );
}
