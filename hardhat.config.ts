import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("./tasks")
require('dotenv').config({ path: __dirname + '/.env' })
const { ETHERSCAN_API_KEY, GOERLI_URL, GOERLI_PK } = process.env


const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

const lazyImport = async (module: any) => {
  return await import(module);
};

task("deploy-and-verify", "Deploy and verify contracts").setAction(async () => {
  const { main } = await lazyImport("./scripts/deploy-and-verify-library");
  await main();
});

module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    //defaultNetwork: "goerli",
    localhost: {
      allowUnlimitedContractSize: true,
    },
    hardhat: {},
    goerli: {
      url: GOERLI_URL,
      accounts: [
        GOERLI_PK
      ],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
  },
  mocha: {
    timeout: 300000, // 300 seconds max for running tests
  },
};

export default config;