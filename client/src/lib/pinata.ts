import axios from "axios";
require("dotenv").config();

const testAuthentication = async () => {
  try {
    const url = `https://api.pinata.cloud/data/testAuthentication`;
    const response = await axios.get(url, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
      },
    });
    console.log(response.data.message);
  } catch (err) {
    console.error(err);
  }
};

testAuthentication();
