import { ethers } from "@nomiclabs/buidler";

async function main() {
  const factory = await ethers.getContractFactory("Bard");
  let contract = await factory.deploy(
    "Bard",
    "BARD",
    [0, 1, 2, 3, 4],
    process.env.REGISTRY,
    process.env.METADATA_URI
  );
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
