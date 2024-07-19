require("dotenv").config();
const path = require("path");
const API_URL = process.env.NEL_URL;
const PUBLIC_KEY = "0xe4b8f63c111ef118587d30401e1db99f4cfbd900";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
// const inboxPath = path.resolve(__dirname, 'contracts','MyNFT.json', 'MyNFT.json');
const contract = require("../artifacts/contracts/LaunchPadRoundTier.sol/LaunchPadRoundTier.json");
const contractAddress = "0x54Fee4db400179697948Fb29CaC83209f48521Af";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
async function configManager2() {
  let time = Math.floor(Date.now() / 1000)
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
      '0x5a2426DEdE6265ac40127068e33170D06B2cdEAB',
      '30000000000000000000',
      '50000000000000000000',
      '80000000000000000000',
      `1718089200`,
      `1718089800`,
      '250000000000000000000',
      `1718089800`,
      `1718090400`,
      '5000000000000000000',
      '2'
    ).encodeABI()
  }


  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function configManager1() {
  let time = Math.floor(Date.now() / 1000)
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
      '0x5a2426DEdE6265ac40127068e33170D06B2cdEAB',
      '50000000000000000000',
      '0',
      '100000000000000000000',
      `1718080200`,
      `1718082000`,
      '450000000000000000000',
      `1718082000`,
      `1718089200`,
      '5000000000000000000',
      '1'
    ).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function configWhiteList() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    // value: '1000000000000',
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 1500000,
    data: nftContract.methods.configNotTierPharse(
      ['5000000000000000000', `${Math.floor(Date.now() / 1000)}`, `${Math.floor(Date.now() / 1000) + 200}`, '8000000000000000000','0', `${Math.floor(Date.now() / 1000) + 200}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 500}`, '5000000000000000000', '0', '0'],
      ['3000000000000000000', `${Math.floor(Date.now() / 1000) + 500}`, `${Math.floor(Date.now() / 1000) + 700}`, '4000000000000000000','0', `${Math.floor(Date.now() / 1000) + 700}`, `${Math.floor(Date.now() / 1000) + 800}`, '5000000000000000000'],

    ).encodeABI(),
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function cancelConfig() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 200000,
    data: nftContract.methods.configCancelInfo(['120', '5000000000000000000', '0xe4b8f63c111ef118587d30401e1db99f4cfbd900']).encodeABI(),
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function init() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 200000,
    data: nftContract.methods.initialize(
      '0xE4B8f63C111EF118587D30401e1Db99f4CfBD900',
      '0xE4B8f63C111EF118587D30401e1Db99f4CfBD900',
      '0x6d3214eFc611aaAC0d87f760fFF3fb441dE389D0',
      '0x0f308999C96caBdBD4755A183Ba2Bf1D21f0c25b',
      '1',
      '10000000000000000000',
      '0',
      '0'
    ).encodeABI(),
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function run() {
    stake()
}

configManager2()