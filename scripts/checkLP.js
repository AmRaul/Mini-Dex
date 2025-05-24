const hre = require("hardhat");
const fs = require("fs");
const { formatUnits } = require("ethers");

async function main() {
  const data = JSON.parse(fs.readFileSync("deployed_contracts.json"));
  const dex = await hre.ethers.getContractAt("MiniDex", data.dexAddress);
  const clToken = await hre.ethers.getContractAt("CLToken", data.clTokenAddress);
  const fakeUSDT = await hre.ethers.getContractAt("FakeUSDT", data.fakeUSDTAddress);
  // const address = data.ownerAddress;
  const address = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"

  const lpBalance = await dex.balanceOf(address); // owner — адрес, чей баланс LP ты хочешь узнать
  const totalLP = await dex.getTotalSupplyLP();
  const ClBalance = await clToken.balanceOf(address); // ClToken Balance of owner
  const FusdtBalance = await fakeUSDT.balanceOf(address); // FakeUsdt Balance of owner

  console.log("LP токенов у address:", formatUnits(lpBalance, 18));
  console.log("Общее количество LP:", formatUnits(totalLP, 18));
  console.log("ClToken:", formatUnits(ClBalance, 18));
  console.log("Fakeusdt:", formatUnits(FusdtBalance, 18));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
