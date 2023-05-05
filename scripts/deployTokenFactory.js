const { ethers, upgrades } = require("hardhat");
const { contractAt } = require("./helper");

async function main() {
  //BabyToken
  // const BabyToken = await ethers.getContractFactory("BabyToken");
  // const babyToken = await BabyToken.deploy();
  // await babyToken.deployed();
  // console.log(`BabyToken Deployed to ${babyToken.address}`);

  
  //BuybackToken
  const Buyback = await ethers.getContractFactory("BuybackBabyToken");
  const buyback = await Buyback.deploy();
  await buyback.deployed();
  console.log(`Buyback Deployed to ${buyback.address}`);

  
  //LiquidityGeneratorToken
  const Liquidity = await ethers.getContractFactory("LiquidityGeneratorToken");
  const liquidity = await Liquidity.deploy();
  await liquidity.deployed();
  console.log(`Liquidity Deployed to ${liquidity.address}`);


  //StandardToken
  const Standard = await ethers.getContractFactory("StandardToken");
  const standard = await Standard.deploy();
  await standard.deployed();
  console.log(`Standard Deployed to ${standard.address}`);


  // const gas = await ethers.provider.getGasPrice();
  // const poolFactory = await contractAt("PoolFactory", "0x7D438e840e3D22D8aac71E094a5778A67e769096");
  // // const poolFactory = await ;
  // const TokenFactory = await ethers.getContractFactory("TokenFactory");
  // const tokenFactory = await upgrades.deployProxy(
  //   TokenFactory,
  //   [
  //     babyToken.address,
  //     buyback.address,
  //     liquidity.address,
  //     standard.address,
  //     poolFactory.address
  //   ],
  //   {
  //     gasPrice: gas,
  //     initializer: "initialize"
  //   }
  // );

  // await tokenFactory.deployed();
  // console.log(`TokenFactory Deployed to ${tokenFactory.address}`);

  // await poolFactory.setTokenFactory(tokenFactory.address);
  // console.log("Set tokenFactory address");

  // const tokenFactory = "0xdB15759E8ACd0Dd89E5B9e975e1A5a2361834b68";

  // const TokenFactory = await ethers.getContractFactory("TokenFactory");

  // await upgrades.upgradeProxy(tokenFactory, TokenFactory);

  // console.log(`Deployed to`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
