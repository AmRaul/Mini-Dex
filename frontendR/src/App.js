import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import Header from "./components/Header";
import Main from "./pages/Main";
import Trade from "./pages/Trade";
import Faucet from "./pages/Faucet";
import LiquidityPage from "./pages/Liquidity";

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/faucet" element={<Faucet />} />
          <Route path="/liquidity" element={<LiquidityPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
