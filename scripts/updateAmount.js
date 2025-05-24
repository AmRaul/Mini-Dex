const hre = require("hardhat");
const fs = require("fs");
const { parseUnits } = require("ethers");

async function main() {
    const data = JSON.parse(fs.readFileSync("deployed_contracts.json"));
    const faucet = await hre.ethers.getContractAt("Faucet", data.faucetAddress);

    // Пример значений 1000 и 2000 с 18 десятичными
    const amountA = parseUnits("1000", 18);
    const amountB = parseUnits("1000", 18);

    const tx = await faucet.updateAmounts(amountA, amountB);
    console.log("Tx sent, waiting for confirmation...");

    await tx.wait();
    console.log("Amounts updated successfully");

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
  