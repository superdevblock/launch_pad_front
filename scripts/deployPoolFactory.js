const { ethers, upgrades } = require("hardhat");
const { contractAt } = require("./helper");

async function main() {
  const gas = await ethers.provider.getGasPrice();
  const elevAddr = "0x045109cF1Be9eDEC048AA0B3D7a323154a1aEA65";

  const PresalePool = await ethers.getContractFactory("PresalePool");
  const presalepool = await PresalePool.deploy();

  await presalepool.deployed();

  console.log(`Presale implement Deployed to ${presalepool.address}`);

  const PoolManager = await ethers.getContractFactory("PoolManager");
  console.log("Deploying PoolManager...");
  const poolManager = await upgrades.deployProxy(
    PoolManager,
    [
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",  //WETH
      "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",  //ethUSDTpair
    ],
    {
      gasPrice: gas,
      initializer: "initialize",
    }
  );
  await poolManager.deployed();
  console.log("PoolManager Contract deployed to:", poolManager.address);
  await poolManager.initializeTopPools();
  console.log("Initialized:");
  // const poolManager = await contractAt("PoolManager", "0x4Ea243151FEA5806145AB064e06358D5fF101A3E");

  const PoolFactory = await ethers.getContractFactory("PoolFactory");
  console.log("Deploying PoolFactory...");
  const poolfactory = await upgrades.deployProxy(
    PoolFactory,
    [
      // presalepool.address,   //master
      // poolManager.address,
      presalepool.address,
      elevAddr,
      poolManager.address,
      "1",  //version
      "1000000000000000", //kyc price
      "2000000000000000", //audit price
      "1000000000000000", //master price
      "1000", //contributeWithdrawFee
      "true", //isEnabled
    ],
    {
      gasPrice: gas,
      initializer: "initialize",
    }
  );
  await poolfactory.deployed();
  console.log("PoolFactory Contract deployed to:", poolfactory.address);
  await poolfactory.setAdminWallet(
    "0x9033606977d8E088fc744362Ee896fbE92479099"
  );
  console.log("Set Admin Wallet");
  await poolfactory.setPoolOwner(poolfactory.address);
  console.log("Set Pool Owner");

  await poolManager.addAdminPoolFactory(poolfactory.address);
  console.log("addAdminPoolFactory");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
