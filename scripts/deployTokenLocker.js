const { ethers, upgrades } = require("hardhat");

async function main() {
  const TokenLocker = await ethers.getContractFactory("ElevateLocker");
  const tokenLocker = await TokenLocker.deploy();

  await tokenLocker.deployed();

  console.log(`Deployed to ${tokenLocker.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
