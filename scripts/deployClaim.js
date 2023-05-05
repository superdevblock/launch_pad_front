const { ethers, upgrades } = require("hardhat");
const { contractAt } = require("./helper");

async function main() {
    const Claim = await ethers.getContractFactory("Claim");
    const claim = await Claim.deploy();
    await claim.deployed();
    console.log("nft address: ", claim.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
