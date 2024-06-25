const { ethers } = require("hardhat");

async function main() {
  try {
    const [deployer] = await ethers.getSigners();

    console.log(
      "Deploying docstorage contract  with the account:",
      deployer.address
    );
    
    const DocStorage = await ethers.getContractFactory("DocStorage");
    const docStorage = await DocStorage.deploy();

    await docStorage.waitForDeployment();

    console.log(`DocStorage contract deployed to ${docStorage.target}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
