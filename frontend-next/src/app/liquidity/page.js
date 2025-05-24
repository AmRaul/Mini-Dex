"use client";

import { useState } from "react";

const LiquidityPage = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [tokenAAmount, setTokenAAmount] = useState("");
  const [tokenBAmount, setTokenBAmount] = useState("");
  const [lpTokens, setLpTokens] = useState(1000); // примерное значение LP токенов
  const [isPoolOpen, setIsPoolOpen] = useState(false);
  const [removeAmount, setRemoveAmount] = useState(0);

  const handleTokenAChange = (e) => setTokenAAmount(e.target.value);
  const handleTokenBChange = (e) => setTokenBAmount(e.target.value);
  const handleTabChange = (tab) => setActiveTab(tab);
  const handleRemoveAmountChange = (e) => setRemoveAmount(Number(e.target.value));

  const handleAddLiquidity = () => {
    console.log(`Добавление ликвидности: ${tokenAAmount} CL, ${tokenBAmount} FUSDT`);
  };

  const handleRemoveLiquidity = () => {
    console.log(`Удаляем ${removeAmount} LP токенов`);
  };

  const handleOpenPool = () => setIsPoolOpen(!isPoolOpen);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Страница с ликвидностью</h2>

      <button
        onClick={handleOpenPool}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Пул CL-FUSDT
      </button>

      {isPoolOpen && (
        <div>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => handleTabChange("add")}
              className={`px-4 py-2 rounded ${
                activeTab === "add" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Добавление ликвидности
            </button>
            <button
              onClick={() => handleTabChange("remove")}
              className={`px-4 py-2 rounded ${
                activeTab === "remove" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Удаление ликвидности
            </button>
          </div>

          {activeTab === "add" && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Количество CL:</label>
                <input
                  type="number"
                  value={tokenAAmount}
                  onChange={handleTokenAChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Количество FUSDT:</label>
                <input
                  type="number"
                  value={tokenBAmount}
                  onChange={handleTokenBChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={handleAddLiquidity}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Добавить ликвидность
              </button>
            </div>
          )}

          {activeTab === "remove" && (
            <div className="space-y-4">
              <p>Ваши LP токены: {lpTokens}</p>

              <label className="block mb-1">
                Количество для удаления:
                <input
                  type="number"
                  value={removeAmount}
                  onChange={handleRemoveAmountChange}
                  min={0}
                  max={lpTokens}
                  className="w-full p-2 border rounded mt-1"
                />
              </label>

              <p>
                Количество возврата (пример): {removeAmount * 2} CL и {removeAmount * 2} FUSDT
              </p>

              <button
                onClick={handleRemoveLiquidity}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Удалить ликвидность
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiquidityPage;
