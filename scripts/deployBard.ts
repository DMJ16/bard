// import { ethers } from "@nomiclabs/buidler";

// async function main() {
//   const factory = await ethers.getContractFactory("BardFactory");
//   let contract = await factory.deploy();
//   console.log(contract.address);
//   console.log(contract.deployTransaction.hash);
//   await contract.deployed();
// }

// main()
//   .then(() => process.exit(0))
//   .catch((err) => {
//     console.error(err);
//     process.exit(1);
//   });
// import { BardFactoryFactory } from "../typechain/BardFactoryFactory";
// import { Wallet, Contract, ContractFactory, Signer } from "ethers";
// let bardAddress: string;
// let bard: BardFactoryFactory;
// const signers = await ethers.getSigners();
// const deployer = <Wallet>signers[0];
// const deployerAddress = await deployer.getAddress();

// const bardFactory = await deployContract(deployer, BardFactoryArtifact);
// await bardFactory.createBard(
//   "Bard",
//   "BARD",
//   [0, 1, 2, 3, 4],
//   deployerAddress,
//   process.env.METADATA_URI
// );
// [bardAddress] = await bardFactory.getDeployedBards();
// bard = new ethers.Contract(bardAddress, BardArtifact.abi, deployer);

// "Bard",
// "BARD",
// [0, 1, 2, 3, 4],
// process.env.METADATA_URI
