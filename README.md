# ERC1155 Contract 📄

### Technology and Tools 🧰

Node.js | TypeScript | Solidity | OpenZeppelin | Buidler | TypeChain | Ethers | IPFS

<br>

### Contracts 🔏 🍬

Fungibility agnostic contract for unique and semi-unique assets. Contract acts as a wrapper around valuable asset metadata.

<br>

### Usage 👾 🧸 📚 🎥 🎨

Users can spawn new contracts from the factory contract at the below address. Toys, collectibles, in game items, books, video, music and art are all semi-unique or fully unique items worth tokenizing to ensure digital scarcity.

Factory Contract Address: rinkeby.etherscan.io/address/0xa89eeb0d82f06e1f0e28d80440eee63e51720a9

Provide the contract creation function with JSON metadata that has a URI field pointing to the asset's online location.

#### Example Metadata:

```
{
  "type": "album",
  "name": "Father Of The Bride",
  "description": "Vampire Weekend's fourth studio album. Winner of the Grammy Award for Best Alternative Music Album",
  "image": "https://assets0.dostuffmedia.com/uploads/aws_asset/aws_asset/867844/c5989562-da57-4314-bac6-d49a05be5123.jpg",
  "contentURI": /* "example mp4 address" */
}
```

<br>

### Contract Tests 🧪

Contract test suite written with mocha, chai, typechain and buidler.

<br>

### DAO 🗳️

Proof-of-concept Rinkeby testnet DAO. Each member could proportionally participate in the governance of a service such as a distributed content distribution platform.

DAO Address: rinkeby.etherscan.io/address/0xfebabe2690083b38bbacf329763a8a4c1f5b0789
