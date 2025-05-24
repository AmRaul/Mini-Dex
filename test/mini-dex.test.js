const { expect } = require("chai");
const hre = require("hardhat");
const { parseUnits, formatUnits } = require("ethers");
const fs = require("fs")

describe("Mini DEX Deployment", function () {
  let clToken, fakeUSDT, dex, faucet, lpToken;
  let owner, user;

  // Задаем параметры, которые будем передавать в конструкторы
  const initialMintTokens = parseUnits("100000", 18);       // Пример: 100,000 токенов первичный минт
  const maxSupplyTokens   = parseUnits("100000000", 18);    // Пример: 100,000,000 токенов максимум

  beforeEach(async function () {
    [owner, user] = await hre.ethers.getSigners();

    const CLToken = await hre.ethers.getContractFactory("CLToken");
    clToken = await CLToken.deploy(owner.address, owner.address, initialMintTokens, maxSupplyTokens);
    await clToken.waitForDeployment();

    const FakeUSDT = await hre.ethers.getContractFactory("FakeUSDT");
    fakeUSDT = await FakeUSDT.deploy(owner.address, owner.address, initialMintTokens, maxSupplyTokens);
    await fakeUSDT.waitForDeployment();

    const Dex = await hre.ethers.getContractFactory("MiniDex");
    dex = await Dex.deploy(clToken.target, fakeUSDT.target, owner.address);  // .target вместо .address
    await dex.waitForDeployment();

    const lpTokenAddress = await dex.lpToken();
    lpToken = await hre.ethers.getContractAt("LPToken", lpTokenAddress);

    const Faucet = await hre.ethers.getContractFactory("Faucet");
    faucet = await Faucet.deploy(clToken.target, fakeUSDT.target);
    await faucet.waitForDeployment();
    
  });

  it("should deploy all contracts correctly", async function () {
    expect(await clToken.name()).to.equal("TheCryptoLogs");
    expect(await clToken.balanceOf(owner.address)).to.equal(initialMintTokens);
    expect(await fakeUSDT.name()).to.equal("FakeUSDT");
    expect(await lpToken.name()).to.equal("MiniDEX LP");
    expect(await lpToken.symbol()).to.equal("MLP");
    
    expect(await lpToken.owner()).to.equal(dex.target);

    expect(await dex.tokenA()).to.equal(clToken.target);
    expect(await dex.tokenB()).to.equal(fakeUSDT.target);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it("AddLiquidity and remove", async function () {
    const amountA = parseUnits("2000", 18);
    const amountB = parseUnits("2000", 18);

    // Approve dex
    await clToken.approve(dex.target, amountA);
    await fakeUSDT.approve(dex.target, amountB);

    const tx = await dex.addLiquidity(amountA, amountB);
    await tx.wait();

    const reserveA = await dex.getReserveA();
    const reserveB = await dex.getReserveB();

    let lpSupply = await lpToken.totalSupply(); 

    expect(reserveA).to.equal(amountA);
    expect(reserveB).to.equal(amountB);
    expect(lpSupply).to.be.gt(0);

    // Убедись, что LP токены пришли
    const lpBalance = await lpToken.balanceOf(owner.address);
    console.log("LP balance before remove:", formatUnits(lpBalance,18));

    // Одобрение MiniDex на сжигание LP токенов
    await lpToken.approve(dex.target, lpBalance);

    const liquidity = parseUnits("1000", 18);
    const txRemove = await dex.removeLiquidity(liquidity);
    await txRemove.wait();

    lpSupply = await lpToken.totalSupply();
    expect(lpSupply).to.equal(parseUnits("3000",18));
    console.log("LP balance after remove:", formatUnits(await lpToken.balanceOf(owner.address),18));
  });

  // it("RemoveLiquidity", async function() {
  //     const liquidity = parseUnits("1000", 18);

  //     const tx = await dex.removeLiquidity(liquidity);
  //     await tx.wait();

  //     const lpSupply = await lpToken.totalSupply();
  //     expect(lpSupply).to.equal(2000);
  // }); 
});
