const { ethers, upgrades } = require("hardhat");

async function main() {
  const PoolFactory = await ethers.getContractFactory("PresalePool");
  const poolFactory = await PoolFactory.deploy();

  await poolFactory.deployed();

  console.log(`Deployed to ${poolFactory.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
