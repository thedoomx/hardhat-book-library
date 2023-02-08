import { task } from "hardhat/config";

task("deploy-library", "Deploys Library Contract").setAction(
  async (_args, { ethers, run }) => {
    const hre = require("hardhat");

    await run("compile");

    const Library_Factory = await ethers.getContractFactory("Library");
    const library = await Library_Factory.deploy();
    await library.deployed();

    await hre.run('print', { message: `The Library contract is deployed to ${library.address}` })
  }
);