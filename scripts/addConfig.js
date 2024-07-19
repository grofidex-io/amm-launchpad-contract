require("dotenv").config();
const path = require("path");
const API_URL = process.env.NEL_URL;
const PUBLIC_KEY = "0xe4b8f63c111ef118587d30401e1db99f4cfbd900";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
// const inboxPath = path.resolve(__dirname, 'contracts','MyNFT.json', 'MyNFT.json');
const contract = require("../artifacts/contracts/LaunchPadManager.sol/LaunchPadManager.json");
const contractAddress = "0x887952E36731884a0A38Cb15eEAdeA11D44572FB";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
async function configManager() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  let start = `${Math.floor(Date.now() / 1000)}`
  let end = `${Math.floor(Date.now() / 1000) + 16000}`
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
      '0xE4B8f63C111EF118587D30401e1Db99f4CfBD900',
      '0x6d3214eFc611aaAC0d87f760fFF3fb441dE389D0',
      '0x0f308999C96caBdBD4755A183Ba2Bf1D21f0c25b',
      '10000000000000000000',
      '1718161200',
      '1718184600',
      '500000000000000000000'
    ).encodeABI()
  }

  console.log(await nftContract.methods.viewTierPhase('0xE4B8f63C111EF118587D30401e1Db99f4CfBD900').call())
  return 
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

configManager()