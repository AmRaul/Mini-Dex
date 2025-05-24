import React from "react";

const WalletModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">Выберите кошелек</h3>

        <button
          onClick={() => onSelect("metamask")}
          className="w-full bg-blue-600 text-white py-2 rounded mb-3 hover:bg-blue-700 transition"
        >
          MetaMask
        </button>

        {/* Можно добавить другие кошельки здесь */}

        <button
          onClick={onClose}
          className="w-full py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default WalletModal;
