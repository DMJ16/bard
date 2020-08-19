import { ethers } from "@nomiclabs/buidler";
import { Wallet, Contract, ContractFactory, Signer } from "ethers";
import chai from "chai";
import { solidity, deployContract } from "ethereum-waffle";
import BardArtifact from "../artifacts/Bard.json";
import BardFactoryArtifact from "../artifacts/BardFactory.json";
import { Bard } from "../typechain/Bard";
import { BardFactory } from "../typechain/BardFactory";

chai.use(solidity);
const { expect } = chai;

let bardFactory: BardFactory | Contract;
let bard: Bard | Contract;
let deployer: Wallet;
let deployerAddress: string;
let signers: Signer[];
let bardAddress: string;

beforeEach(async () => {
  signers = await ethers.getSigners();
  deployer = <Wallet>signers[0];
  deployerAddress = await deployer.getAddress();
  bardFactory = await deployContract(deployer, BardFactoryArtifact);
  await bardFactory.createBard("Bard", "BARD", process.env.METADATA_URI);
  await bardFactory.createBard("Bard", "BARD", process.env.METADATA_URI);
  [bardAddress] = await bardFactory.getDeployedBards();
  bard = new ethers.Contract(bardAddress, BardArtifact.abi, deployer);
});

describe("Bard", () => {
  it("mints single token", async () => {
    await bard.mint(0, 10 ** 6);
    const albumCount = await bard.balanceOf(deployerAddress, 0);
    expect(albumCount).to.eq(10 ** 6);
  });

  it("batch mints multiple tokens", async () => {
    const async = [
      await bard.mintBatch([1, 2, 3, 4], [10 ** 6, 10 ** 5, 10 ** 4, 1]),
      await bard.balanceOfBatch(
        [deployerAddress, deployerAddress, deployerAddress, deployerAddress],
        [1, 2, 3, 4]
      ),
    ];

    const [_, balance] = await Promise.all(async);

    expect(balance[0]).to.eq(10 ** 6);
    expect(balance[1]).to.eq(10 ** 5);
    expect(balance[2]).to.eq(10 ** 4);
    expect(balance[3]).to.eq(1);
  });

  it("has unique URI metadata for each token", async () => {
    const urlArr = [
      bard.uri(0),
      bard.uri(1),
      bard.uri(2),
      bard.uri(3),
      bard.uri(4),
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

  it("can reset URI", async () => {
    await bard.setURI(
      `https://ipfs.io/ipfs/QmRa52zzgCq2Vsaxb8nUxUVmpYhsULKtHtkCFPskL39aFK`
    );
    const uri = await bard.uri(0);
    expect(await bard.getURI(uri, 0)).to.eq(
      `https://ipfs.io/ipfs/QmRa52zzgCq2Vsaxb8nUxUVmpYhsULKtHtkCFPskL39aFK/0.json`
    );

    await bard.setURI(process.env.METADATA_URI);
    const resetURI = await bard.uri(0);
    expect(await bard.getURI(resetURI, 0)).to.eq(
      `${process.env.METADATA_URI}/0.json`
    );
  });
});
