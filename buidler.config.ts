import { BuidlerConfig, usePlugin } from "@nomiclabs/buidler/config";
usePlugin("@nomiclabs/buidler-waffle");
usePlugin("buidler-typechain");
const config: BuidlerConfig = {
  solc: {
    version: "0.5.15",
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v4",
  },
};
export default config;

// import { task, usePlugin, BuidlerConfig } from "@nomiclabs/buidler/config";
// usePlugin("@nomiclabs/buidler-waffle");
// usePlugin("buidler-typechain");

// task("accounts", "Prints the list of accounts", async (taskArgs, bre) => {
//   const accounts = await bre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(await account.getAddress());
//   }
// });

// const config: BuidlerConfig = {};

// export default config;

// const { BuidlerConfig, usePlugin } = require("@nomiclabs/buidler/config");
// usePlugin("@nomiclabs/buidler-waffle");
// usePlugin("buidler-typechain");
// module.exports = {
//   solc: {
//     version: "0.5.15",
//   },
//   typechain: {
//     outDir: "typechain",
//     target: "ethers-v4",
//   },
// };
