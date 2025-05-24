const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const faucetRoutes = require("./routes/faucet");

dotenv.config();

const app = express(); // ← сначала создаём app

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());
app.use("/api/faucet", faucetRoutes);

app.get("/", (req, res) => {
  res.send("Сервер работает");
});

const port = process.env.PORT || 43000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
