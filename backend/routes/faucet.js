const express = require("express");
const router = express.Router();
const { requestTokens } = require("../controllers/faucetController");
console.log("Faucet");

router.post("/drip", requestTokens);

module.exports = router;
