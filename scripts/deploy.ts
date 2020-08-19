import { ethers } from "@nomiclabs/buidler";
import { Wallet, Contract, ContractFactory, Signer } from "ethers";
import { Bard } from "../typechain/Bard";

async function main() {
  let bardAddress: string;
  let bard: Bard;
  const signers = await ethers.getSigners();
  const deployer = <Wallet>signers[0];
  const deployerAddress = await deployer.getAddress();
  // const factory = await ethers.getContractFactory("BardFactory");
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

  // let contract = await factory.deploy();
  // "Bard",
  // "BARD",
  // [0, 1, 2, 3, 4],
  // process.env.METADATA_URI

  // console.log(contract.address);
  // console.log(contract.deployTransaction.hash);
  // await contract.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
