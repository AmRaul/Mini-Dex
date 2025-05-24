import React, { useState } from "react";

const LiquidityPage = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [tokenAAmount, setTokenAAmount] = useState("");
  const [tokenBAmount, setTokenBAmount] = useState("");
  const [lpTokens, setLpTokens] = useState(1000); // Примерное значение для LP токенов
  const [isPoolOpen, setIsPoolOpen] = useState(false); // Контроль отображения формы
  const [removeAmount, setRemoveAmount] = useState(0);

  const handleTokenAChange = (e) => {
    setTokenAAmount(e.target.value);
  };

  const handleTokenBChange = (e) => {
    setTokenBAmount(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddLiquidity = () => {
    console.log(`Добавление ликвидности: ${tokenAAmount} CL, ${tokenBAmount} FUSDT`);
  };

  const handleRemoveAmountChange = (event) => {
    setRemoveAmount(event.target.value);
  };

  const handleRemoveLiquidity = () => {
    // Здесь можно добавить логику для удаления ликвидности
    console.log(`Удаляем ${removeAmount} LP токенов`);
  };

  const handleOpenPool = () => {
    if (isPoolOpen) {
      setIsPoolOpen(false); // Закрыть пул
    } else {
      setIsPoolOpen(true); // Открыть пул
    }
  };
  

  return (
    <div>
      <h2>Страница с ликвидностью</h2>

      {/* Кнопка для открытия пула */}
      <button onClick={handleOpenPool}>Пул CL-FUSDT</button>

      {/* Если пул открыт, показываем раздел добавления/удаления ликвидности */}
      {isPoolOpen && (
        <div>
          <div>
            <button
              onClick={() => handleTabChange("add")}
              className={activeTab === "add" ? "active" : ""}
            >
              Добавление ликвидности
            </button>
            <button
              onClick={() => handleTabChange("remove")}
              className={activeTab === "remove" ? "active" : ""}
            >
              Удаление ликвидности
            </button>
          </div>

          {activeTab === "add" && (
            <div>
              <h3>Добавление ликвидности</h3>
              <div>
                <label>
                  Количество CL:
                  <input
                    type="number"
                    value={tokenAAmount}
                    onChange={handleTokenAChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  Количество FUSDT:
                  <input
                    type="number"
                    value={tokenBAmount}
                    onChange={handleTokenBChange}
                  />
                </label>
              </div>
              <div>
                <button onClick={handleAddLiquidity}>Добавить ликвидность</button>
              </div>
            </div>
          )}

          {activeTab === "remove" && (
            <div>
                <p>Ваши LP токены: {lpTokens}</p>
                
                <label>
                    Количество для удаления:
                    <input
                    type="number"
                    value={removeAmount}
                    onChange={handleRemoveAmountChange}
                    min="0"
                    max={lpTokens} // чтобы нельзя было ввести больше, чем доступно
                    />
                </label>

                <p>Количество возврата (пример): {removeAmount * 2} CL и {removeAmount * 2} FUSDT</p>
                
                <button onClick={handleRemoveLiquidity}>Удалить ликвидность</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiquidityPage;
