import { ethers } from "@nomiclabs/buidler";
import { Wallet, Contract } from "ethers";
import chai from "chai";
import { solidity, deployContract } from "ethereum-waffle";
import BardArtifact from "../artifacts/Bard.json";
import { Bard } from "../typechain/Bard";

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
      process.env.REGISTRY,
      process.env.METADATA_URI,
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

  it("has unique URI metadata for each token", async () => {
    const urlArr = [
      await bard.uri(0),
      await bard.uri(1),
      await bard.uri(2),
      await bard.uri(3),
      await bard.uri(4),
    ];

    const [uri_0, uri_1, uri_2, uri_3, uri_4] = await Promise.all(urlArr);

    const getURI = [
      bard.getURI(uri_0, 0),
      bard.getURI(uri_1, 1),
      bard.getURI(uri_2, 2),
      bard.getURI(uri_3, 3),
      bard.getURI(uri_4, 4),
    ];

    const [album, song, video, screenplay, book] = await Promise.all(getURI);

    expect(album).to.eq(`${process.env.METADATA_URI}/0.json`);

    expect(song).to.eq(`${process.env.METADATA_URI}/1.json`);

    expect(video).to.eq(`${process.env.METADATA_URI}/2.json`);

    expect(screenplay).to.eq(`${process.env.METADATA_URI}/3.json`);

    expect(book).to.eq(`${process.env.METADATA_URI}/4.json`);
  });
});
