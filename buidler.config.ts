import { BuidlerConfig, usePlugin } from "@nomiclabs/buidler/config";
usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@nomiclabs/buidler-etherscan");
usePlugin("buidler-typechain");
require("dotenv").config();

const config: BuidlerConfig = {
  defaultNetwork: "buidlerevm",
  solc: {
    version: "0.6.8",
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    buidlerevm: {
      throwOnCallFailures: true,
      throwOnTransactionFailures: true,
      blockGasLimit: 6721975,
    },
    rinkeby: {
      url: process.env.INFURA,
      accounts: [process.env.RINKEBY as string],
    },
  },
  etherscan: {
    url: "https://api-rinkeby.etherscan.io/api",
    apiKey: process.env.ETHERSCAN as string,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v4",
  },
};
export default config;
