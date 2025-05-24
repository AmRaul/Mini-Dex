const hre = require("hardhat");
const fs = require("fs");
const { parseUnits } = require("ethers");

async function main() {
  const [owner, user] = await hre.ethers.getSigners();
  const data = JSON.parse(fs.readFileSync("deployed_contracts.json"));

  const clToken = await hre.ethers.getContractAt("CLToken", data.clTokenAddress, user);
  const fakeUSDT = await hre.ethers.getContractAt("FakeUSDT", data.fakeUSDTAddress, user);
  const dex = await hre.ethers.getContractAt("MiniDex", data.dexAddress, user);

  const amountA = parseUnits("1000", 18);
  const amountB = parseUnits("1000", 18);

  // Approve
  await clToken.approve(dex.target, amountA);
  await fakeUSDT.approve(dex.target, amountB);

  console.log("Approved tokens for DEX.");

  // Add liquidity
  const tx = await dex.addLiquidity(amountA, amountB);
  await tx.wait();

  console.log("Liquidity added.");

  // Get reserves
  const reserveA = await dex.getReserveA();
  const reserveB = await dex.getReserveB();
  const lpSupply = await dex.getTotalSupplyLP();

  console.log("Reserve A:", reserveA.toString());
  console.log("Reserve B:", reserveB.toString());
  console.log("LP Supply:", lpSupply.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
