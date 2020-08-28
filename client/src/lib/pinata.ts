require("dotenv").config();
import axios from "axios";
import { AES, enc } from "crypto-ts";
import { CipherParams } from "crypto-ts/src/lib/CipherParams";

function generatePassword() {
  return Math.random()
    .toString(36)
    .slice(-8);
}

const pinata_api_key = process.env.PINATA_API_KEY;
const pinata_secret_api_key = process.env.PINATA_SECRET_KEY;

export interface JSONBody {
  name?: string;
  description?: string;
  symbol?: string;
  image?: string;
  content?: string | CipherParams;
}

export interface Success {
  data: {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
  };
  password: string;
}
export async function pinJSONToIPFS(
  JSONBody: JSONBody
): Promise<Success | undefined> {
  try {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const newPassword = generatePassword();
    JSONBody.content = AES.encrypt(
      JSONBody.content as string,
      newPassword
    ).toString();
    const pinnedJSON = await axios.post(url, JSONBody, {
      headers: {
        pinata_api_key,
        pinata_secret_api_key,
      },
    });
    return { data: pinnedJSON.data, password: newPassword };
  } catch (err) {
    console.error(err);
  }
}

export async function decryptJSON(hash: string, password: string) {
  try {
    const encryptedJSON = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${hash}`
    );

    const decryptedData = AES.decrypt(
      encryptedJSON.data.content.toString(),
      password
    ).toString(enc.Utf8);

    return decryptedData;
  } catch (err) {
    console.error(err);
  }
}
