import { ethers } from "@nomiclabs/buidler";
import { Wallet, Contract, Signer } from "ethers";
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
let bard2: Bard | Contract;
let wallet: Wallet;
let wallet2: Wallet;
let walletAddr: string;
let walletAddr2: string;
let signers: Signer[];
let bardAddress: string;

beforeEach(async () => {
  signers = await ethers.getSigners();
  wallet = <Wallet>signers[0];
  wallet2 = <Wallet>signers[1];
  walletAddr = await wallet.getAddress();
  walletAddr2 = await wallet2.getAddress();
  bardFactory = await deployContract(wallet, BardFactoryArtifact);
  await bardFactory.createBard("Bard", "BARD", process.env.METADATA_URI);
  [bardAddress] = await bardFactory.getDeployedBards();
  bard = new ethers.Contract(bardAddress, BardArtifact.abi, wallet);
  bard2 = new ethers.Contract(bardAddress, BardArtifact.abi, wallet2);
});

describe("Bard", () => {
  it("mints single token", async () => {
    const promises = [
      bard.mint(0, 6),
      bard.balanceOf(walletAddr, 0),
      bard.tokenSupply(0),
    ];
    const [_, albumCount, tokenSupply] = await Promise.all(promises);
    expect(albumCount).to.eq(6);
    expect(tokenSupply).to.eq(6);
  });

  it("batch mints multiple tokens", async () => {
    const async = [
      await bard.mintBatch([1, 2, 3, 4], [10 ** 6, 10 ** 5, 10 ** 4, 1]),
      await bard.balanceOfBatch(
        [walletAddr, walletAddr, walletAddr, walletAddr],
        [1, 2, 3, 4]
      ),
    ];
    const [_, balance] = await Promise.all(async);
    expect(balance[0]).to.eq(10 ** 6);
    expect(balance[1]).to.eq(10 ** 5);
    expect(balance[2]).to.eq(10 ** 4);
    expect(balance[3]).to.eq(1);
    const tokenSupplies = [
      bard.tokenSupply(1),
      bard.tokenSupply(2),
      bard.tokenSupply(3),
      bard.tokenSupply(4),
    ];
    const tokenSupply = await Promise.all(tokenSupplies);
    expect(tokenSupply[0]).to.eq(10 ** 6);
    expect(tokenSupply[1]).to.eq(10 ** 5);
    expect(tokenSupply[2]).to.eq(10 ** 4);
    expect(tokenSupply[3]).to.eq(1);
  });
  it("manager or approved address can set prices for assets", async () => {
    const setPrices = [
      bard.setPrice(0, 1),
      bard.setPrice(1, 2),
      bard.setPrice(2, 3),
      bard.setPrice(3, 4),
      bard.setPrice(4, 5),
    ];
    await Promise.all(setPrices);
    const getPrices = [
      bard.tokenPrices(0),
      bard.tokenPrices(1),
      bard.tokenPrices(2),
      bard.tokenPrices(3),
      bard.tokenPrices(4),
    ];
    const [album, song, video, screenplay, book] = await Promise.all(getPrices);
    expect(album).to.eq(1);
    expect(song).to.eq(2);
    expect(video).to.eq(3);
    expect(screenplay).to.eq(4);
    expect(book).to.eq(5);
  });

  it("sell individual tokens", async () => {
    const actions = [
      bard.mintBatch([0, 1], [10, 10 ** 5]),
      bard.setPrice(0, 1),
      bard.setPrice(1, 2),
    ];
    await Promise.all(actions);

    const deposits = [
      bard2.customerDeposit(0, 1, { value: ethers.utils.parseEther("1") }),
      bard2.customerDeposit(1, 1, { value: ethers.utils.parseEther("2") }),
    ];
    await Promise.all(deposits);

    const getDeposits = [
      bard.getCustomerDeposit(walletAddr2, 0),
      bard.getCustomerDeposit(walletAddr2, 1),
    ];
    const [dep0, dep1] = await Promise.all(getDeposits);

    expect(dep0).to.eq(1);
    expect(dep1).to.eq(1);

    bard.on("Order", async (_customer, _id, _amount) => {
      await bard.fillOrder(_customer, _id, _amount);

      const balances = [
        bard2.balanceOf(walletAddr, 0),
        bard.balanceOf(walletAddr2, 0),
        bard2.balanceOf(walletAddr, 1),
        bard.balanceOf(walletAddr2, 1),
      ];
      const [mgrBal0, custBal0, mgrBal1, custBal1] = await Promise.all(
        balances
      );
      expect(mgrBal0).to.eq(9);
      expect(custBal0).to.eq(1);
      expect(mgrBal1).to.eq(99999);
      expect(custBal1).to.eq(1);
    });
  });

  it("batch sell tokens", async () => {
    const actions = [
      bard.mintBatch([0, 1], [10, 10 ** 5]),
      bard.setPrice(0, 1),
      bard.setPrice(1, 2),
    ];
    await Promise.all(actions);

    await bard2.customerDepositBatch([0, 1], [1, 1], {
      value: ethers.utils.parseEther("3"),
    });

    const getDeposits = [
      bard.getCustomerDeposit(walletAddr2, 0),
      bard.getCustomerDeposit(walletAddr2, 1),
    ];
    const [dep0, dep1] = await Promise.all(getDeposits);

    expect(dep0).to.eq(1);
    expect(dep1).to.eq(1);

    bard.on("OrderBatch", async (_customer, _ids, _amounts) => {
      await bard.fillOrderBatch(_customer, _ids, _amounts);

      const balances = [
        bard2.balanceOf(walletAddr, 0),
        bard.balanceOf(walletAddr2, 0),
        bard2.balanceOf(walletAddr, 1),
        bard.balanceOf(walletAddr2, 1),
      ];
      const [mgrBal0, custBal0, mgrBal1, custBal1] = await Promise.all(
        balances
      );
      expect(mgrBal0).to.eq(9);
      expect(custBal0).to.eq(1);
      expect(mgrBal1).to.eq(99999);
      expect(custBal1).to.eq(1);
    });
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
