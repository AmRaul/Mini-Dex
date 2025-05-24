const { ethers } = require("ethers");
const dotenv = require("dotenv");
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

module.exports = { provider, wallet };
