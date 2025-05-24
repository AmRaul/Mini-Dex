const hre = require("hardhat");
const fs = require("fs");
const { parseUnits } = require("ethers");

async function addFaucet() {
    const [owner] = await hre.ethers.getSigners();
    const data = JSON.parse(fs.readFileSync("deployed_contracts.json"));

    const clToken = await hre.ethers.getContractAt("CLToken", data.clTokenAddress);
    const fakeUSDT = await hre.ethers.getContractAt("FakeUSDT", data.fakeUSDTAddress);
    const faucet = await hre.ethers.getContractAt("Faucet", data.faucetAddress);

    const amountA = parseUnits('80000', 18);
    const amountB = parseUnits('80000', 18);

    await clToken.approve(faucet.target, amountA);
    await fakeUSDT.approve(faucet.target, amountB);

    console.log("Approved tokens for Faucet.");

    let tx = await clToken.transfer(faucet.target, amountA);
    await tx.wait();

    tx = await fakeUSDT.transfer(faucet.target, amountB);
    await tx.wait();

    console.log("Tokens transferred to Faucet.");

    // // GetBalance 
    // const ownerBalanceA = await clToken.balanceOf(owner.address);
    // console.log("Owner balance of Token A:", ownerBalanceA.toString());

    // const ownerBalanceB = await fakeUSDT.balanceOf(owner.address);
    // console.log("Owner balance of Token B:", ownerBalanceB.toString());


}

addFaucet().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});