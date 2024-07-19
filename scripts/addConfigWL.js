require("dotenv").config();
const path = require("path");
const API_URL = process.env.NEL_URL;
const PUBLIC_KEY = "0xe4b8f63c111ef118587d30401e1db99f4cfbd900";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
// const inboxPath = path.resolve(__dirname, 'contracts','MyNFT.json', 'MyNFT.json');
const contract = require("../artifacts/contracts/LaunchPadRoundWhiteList.sol/LaunchPadRoundWhiteList.json");
const contractAddress = "0xe7E8a968fB9eEbfb1646117975c1650aF4646475";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
async function configManager() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    // value: '1000000000000',
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 1500000,
    // data: nftContract.methods.configTierInfo([
    //   ['1', '10000000000000000000', '5000000000000000000', `${Math.floor(Date.now() / 1000)}`, `${Math.floor(Date.now() / 1000) + 200}`, '8000000000000000000', `${Math.floor(Date.now() / 1000) + 200}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 500}`, '5000000000000000000'],
    // ]).encodeABI(),
    data: nftContract.methods.updateConfig(
      '0x86701B87AAce71c2feC3Aeb1557d5541E6600F85',
      '1718008200',
      '1718071200',
      '80000000000000000000',
      `1718071200`,
      `1718074800`,
      '250000000000000000000',
      `1718071200`,
      `1718074800`,
      '5000000000000000000',
    ).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}



configManager()