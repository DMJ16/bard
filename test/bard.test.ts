import { ethers } from "@nomiclabs/buidler";
import { Wallet, Contract } from "ethers";
import chai from "chai";
import { solidity, deployContract } from "ethereum-waffle";
import BardArtifact from "../artifacts/Bard.json";
import { Bard } from "../typechain/Bard";
import { sign } from "crypto";

chai.use(solidity);
const { expect } = chai;

describe("Bard", () => {
  let bard: Bard | Contract;
  let deployer: Wallet;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    deployer = <Wallet>signers[0];
    bard = await deployContract(deployer, BardArtifact, [
      "Bard",
      "BARD",
      [0, 1, 2, 3, 4],
      "0xf57b2c51ded3a29e6891aba85459d600256cf317",
      "https://ipfs.io/ipfs/QmQpo6aBNWWxV7Zzdp7dUsHnfC5qQqjWyED15kiP7JrrQh?filename=bard.json",
    ]);
  });

  it("records NFT creation", async () => {
    const deployerAddress = await deployer.getAddress();
    await bard.mint(0, 10 ** 6);
    const albumCount = await bard.balanceOf(deployerAddress, 0);
    expect(albumCount).to.eq(10 ** 6);
  });

  it("batch mints multiple tokens", async () => {
    const deployerAddress = await deployer.getAddress();
    await bard.mintBatch([1, 2, 3, 4], [10 ** 6, 10 ** 5, 10 ** 4, 1]);
    const batch = await bard.balanceOfBatch(
      [deployerAddress, deployerAddress, deployerAddress, deployerAddress],
      [1, 2, 3, 4]
    );
    expect(batch[0]).to.eq(10 ** 6);
    expect(batch[1]).to.eq(10 ** 5);
    expect(batch[2]).to.eq(10 ** 4);
    expect(batch[3]).to.eq(1);
  });

  it("has unique URI metadata for each token", async () => {});
});
