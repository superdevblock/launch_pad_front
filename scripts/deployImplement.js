const { ethers, upgrades } = require("hardhat");
const { contractAt } = require("./helper");

async function main() {
    const Implement = await ethers.getContractFactory("Distribute");
    const implement = await Implement.deploy();
    await implement.deployed();
    console.log("implement address: ", implement.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
