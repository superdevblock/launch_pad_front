// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

async function main() {
  const logic = '0x5f3754F208cBe7e96b0AEA35BabEE471dBdB3Ce8';
  // const admin = '0x99043BE6678C008eB8f6402fd371eb406E0a1644'; // main
  const admin = '0x55c085270a0fdb9481c21eb6ab9a7ba9bfc6da68'; // test
  // const data = "0x8129fc1c" // initialize
  const data = "0x3447439c000000000000000000000000c1dbc1d22f43b9974f9f243e0a5d387d1ff5156c000000000000000000000000608b43ef7c1ec64ee7c8167b68d52addec04fb87000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000071afd498d000000000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000001000000000000000000000000748427e3df8d0e8c420a9b9cedd1393fbcca8ef6"
  
  const test = await ethers.getContractFactory("TransparentUpgradeableProxy");
  const res = await test.deploy(logic, admin, data);
  await res.deployed();
  console.log("proxy address: ", res.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
