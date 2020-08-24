import ethers, { Contract } from "ethers";
import { abi } from "../../../artifacts/BardFactory.json";
import { BardFactory } from "../../../typechain/BardFactory";

const FACTORY_ADDRESS = "0xA89eeB0D82f06e1f0E28d80440EEE63E51720A92";

const provider = new ethers.providers.InfuraProvider(
  "rinkeby",
  process.env.INFURA
);

const wallet = new ethers.Wallet(process.env.RINKEBY as string, provider);

const factory: BardFactory | Contract = new ethers.Contract(
  FACTORY_ADDRESS,
  abi,
  wallet
);

export default factory;
