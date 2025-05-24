const hre = require("hardhat");
const fs = require("fs");
const { parseUnits } = require("ethers");

async function main() {
  let clToken, fakeUSDT, dex, faucet, lpToken;
  let owner, user;

  const initialMintTokens = parseUnits("100000", 18); // 100,000 токенов
  const maxSupplyTokens = parseUnits("100000000", 18); // 100,000,000 токенов

  [owner, user] = await hre.ethers.getSigners();

  const CLToken = await hre.ethers.getContractFactory("CLToken");
  clToken = await CLToken.deploy(owner.address, owner.address, initialMintTokens, maxSupplyTokens);
  await clToken.waitForDeployment();

  const FakeUSDT = await hre.ethers.getContractFactory("FakeUSDT");
  fakeUSDT = await FakeUSDT.deploy(owner.address, owner.address, initialMintTokens, maxSupplyTokens);
  await fakeUSDT.waitForDeployment();

  const Dex = await hre.ethers.getContractFactory("MiniDex");
  dex = await Dex.deploy(clToken.target, fakeUSDT.target, owner.address);
  await dex.waitForDeployment();

  const lpTokenAddress = await dex.lpToken();
  lpToken = await hre.ethers.getContractAt("LPToken", lpTokenAddress);

  const Faucet = await hre.ethers.getContractFactory("Faucet");
  faucet = await Faucet.deploy(clToken.target, fakeUSDT.target);
  await faucet.waitForDeployment();

  const contractAddresses = {
    clTokenAddress: clToken.target,
    fakeUSDTAddress: fakeUSDT.target,
    lpTokenAddress: lpTokenAddress,
    dexAddress: dex.target,
    faucetAddress: faucet.target,
    ownerAddress: owner.address,
    userAddress: user.address
  };

  fs.writeFileSync("deployed_contracts.json", JSON.stringify(contractAddresses, null, 2));

  console.log("Contracts deployed and addresses saved to deployed_contracts.json");
  console.log(contractAddresses);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
