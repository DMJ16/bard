import { ethers } from "@nomiclabs/buidler";

async function main() {
  const factory = await ethers.getContractFactory("BardFactory");
  let contract = await factory.deploy();
  console.log(contract.address);
  console.log(contract.deployTransaction.hash);
  await contract.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
