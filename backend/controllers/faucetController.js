const { ethers } = require("ethers");
const { wallet } = require("../utils/web3");
const faucetAbi = require("../../artifacts/contracts/Faucet.sol/Faucet.json");
const contracts = require("../../deployed_contracts.json");

const faucetAddress = contracts.faucetAddress;
const faucetContract = new ethers.Contract(faucetAddress, faucetAbi.abi, wallet);

const requestTokens = async (req, res) => {
  try {
    console.log("FaucetCont");
    const userAddress = req.body.address;

    if (!ethers.isAddress(userAddress)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    // Проверка времени до следующего запроса
    const waitTime = await faucetContract.timeUntilNextClaim(userAddress);

    if (waitTime > 0n) {
        const waitTimeSec = Number(waitTime); // перевели BigInt в Number (секунды)
        return res.status(429).json({
          error: `Wait ${Math.ceil(waitTimeSec / 60 / 60)} hour before next claim`,
        });
      }

    // Отправляем транзакцию
    const tx = await faucetContract.requestTokens(userAddress, { gasLimit: 500000 });
    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Faucet error:", error);
    res.status(500).json({ error: "Request failed" });
  }
};

module.exports = { requestTokens };
