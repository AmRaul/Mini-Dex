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
    const amountADesired = parseUnits("2000", 18);
    const amountBDesired = parseUnits("1000", 18);
    const amountAMin = parseUnits("1980", 18); // ~1% слп
    const amountBMin = parseUnits("990", 18);

    await clToken.approve(dex.target, amountADesired);
    await fakeUSDT.approve(dex.target, amountBDesired);

    await dex.addLiquidity(amountADesired, amountBDesired, amountAMin, amountBMin);

    let reserveA = await dex.getReserveA();
    let reserveB = await dex.getReserveB();
    let lpSupply = await lpToken.totalSupply();

    expect(reserveA).to.equal(amountADesired);
    expect(reserveB).to.equal(amountBDesired);
    expect(lpSupply).to.be.gt(0);

    const lpBalance = await lpToken.balanceOf(owner.address);
    console.log("LP balance before remove:", formatUnits(lpBalance, 18));

    await lpToken.approve(dex.target, lpBalance);

    const liquidity = lpBalance / 2n; 
    reserveA = await dex.getReserveA(); 
    reserveB = await dex.getReserveB(); 

    const minAmountA = ((reserveA * liquidity) / lpSupply) * 99n / 100n;
    const minAmountB = ((reserveB * liquidity) / lpSupply) * 99n / 100n;

    await dex.removeLiquidity(liquidity, minAmountA, minAmountB);

    lpSupply = await lpToken.totalSupply();
    console.log("LP balance after remove:", formatUnits(await lpToken.balanceOf(owner.address), 18));
  });

  it("двое добавляют ликвидность с допуском проскальзывания", async function () {
    const amountADesired1 = parseUnits("2000", 18);
    const amountBDesired1 = parseUnits("1000", 18);
    const amountAMin1 = parseUnits("1980", 18);
    const amountBMin1 = parseUnits("990", 18);

    await clToken.approve(dex.target, amountADesired1);
    await fakeUSDT.approve(dex.target, amountBDesired1);
    await dex.addLiquidity(amountADesired1, amountBDesired1, amountAMin1, amountBMin1);

    const amountADesired2 = parseUnits("2000", 18);
    const amountBDesired2 = parseUnits("1000", 18);
    const amountAMin2 = parseUnits("1980", 18);
    const amountBMin2 = parseUnits("990", 18);

    await clToken.transfer(user.address, amountADesired2);
    await fakeUSDT.transfer(user.address, amountBDesired2);

    await clToken.connect(user).approve(dex.target, amountADesired2);
    await fakeUSDT.connect(user).approve(dex.target, amountBDesired2);
    await dex.connect(user).addLiquidity(amountADesired2, amountBDesired2, amountAMin2, amountBMin2);

    const lpBalanceOwner = await lpToken.balanceOf(owner.address);
    const lpBalanceUser = await lpToken.balanceOf(user.address);
    console.log("LP owner:", formatUnits(lpBalanceOwner, 18));
    console.log("LP user:", formatUnits(lpBalanceUser, 18));

    expect(lpBalanceOwner).to.be.gt(0);
    expect(lpBalanceUser).to.be.gt(0);
  });

  it("Swap and show change rate", async function() {
    const amountADesired1 = parseUnits("2000", 18);
    const amountBDesired1 = parseUnits("1000", 18);
    const amountAMin1 = parseUnits("1980", 18);
    const amountBMin1 = parseUnits("990", 18);

    await clToken.approve(dex.target, amountADesired1);
    await fakeUSDT.approve(dex.target, amountBDesired1);
    await dex.addLiquidity(amountADesired1, amountBDesired1, amountAMin1, amountBMin1);

    const amountADesired2 = parseUnits("2000", 18);
    const amountBDesired2 = parseUnits("1000", 18);
    const amountAMin2 = parseUnits("1980", 18);
    const amountBMin2 = parseUnits("990", 18);

    await clToken.transfer(user.address, amountADesired2);
    await fakeUSDT.transfer(user.address, amountBDesired2);

    await clToken.connect(user).approve(dex.target, amountADesired2);
    await fakeUSDT.connect(user).approve(dex.target, amountBDesired2);
    await dex.connect(user).addLiquidity(amountADesired2, amountBDesired2, amountAMin2, amountBMin2);

    await clToken.transfer(user.address, amountADesired2);
    await fakeUSDT.transfer(user.address, amountBDesired2);
    
    await clToken.connect(user).approve(dex.target, amountADesired2);
    await fakeUSDT.connect(user).approve(dex.target, amountBDesired2);

    let clTokenBalance = await clToken.balanceOf(user.address);
    let FusdtBalance = await fakeUSDT.balanceOf(user.address);

    console.log("CLToken:", formatUnits(clTokenBalance, 18));
    console.log("FakeUSDT:", formatUnits(FusdtBalance, 18));
    await dex.connect(user).swap(clToken.target, amountADesired2);

    clTokenBalance = await clToken.balanceOf(user.address);
    console.log("CLToken:", formatUnits(clTokenBalance, 18));

    FusdtBalance = await fakeUSDT.balanceOf(user.address);
    console.log("FakeUSDT:", formatUnits(FusdtBalance, 18));
  });



});
