require("dotenv").config();
const path = require("path");
const API_URL = process.env.NEL_URL;
const PUBLIC_KEY = "0xe4b8f63c111ef118587d30401e1db99f4cfbd900";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

let startLP = '1718612100'
let endLP = '1718618400'

let startBuyTier1 = '1718612100'
let endBuyTier1 = '1718613000'
let startCancelTier1 = '1718613000'
let endCancelTier1 = '1718613300'

let startBuyTier2 = '1718613300'
let endBuyTier2 = '1718613900'
let startCancelTier2 = '1718613900'
let endCancelTier2 = '1718614800'

let startApplyWL = '1718612100'
let endApplyWL = '1718615100'
let startBuyWL = '1718615100'
let endBuyWL = '1718616600'


let startBuyCM = '1718616900'
let endBuyCM = '1718618400'


const contract = require("../artifacts/contracts/LaunchPadManager.sol/LaunchPadManager.json");
const contractTier = require("../artifacts/contracts/LaunchPadRoundTier.sol/LaunchPadRoundTier.json");
const contractWLJson = require("../artifacts/contracts/LaunchPadRoundWhiteList.sol/LaunchPadRoundWhiteList.json");
const contractCMJson = require("../artifacts/contracts/LaunchPadRoundCommunity.sol/LaunchPadRoundCommunity.json");

const contractAddressManager = "0x9d2e2f924493450650a3Dd35bFA90543Dce86BE8";
const contractAddressTier1 = "0x6C5f0ed4B118D6164140A1c45183c8680b8D6Ff5";
const contractAddressTier2 = "0x3f7508275dE30f63807BDEC85a8b1DC1231bcf2b";
const contractAddressWL = "0x244ca8efFBABAec8b952747a277e404CaECD5524"
const contractAddressCM = "0xcC25127D933d569559c834E6e4D1D401D31F2526"
const admin = "0x6863991C77BB7d1837055e0d3aE5375129c8d205"

const contractManager = new web3.eth.Contract(contract.abi, contractAddressManager);
const contractTier1 = new web3.eth.Contract(contractTier.abi, contractAddressTier1);
const contractTier2 = new web3.eth.Contract(contractTier.abi, contractAddressTier2);
const contractWL = new web3.eth.Contract(contractWLJson.abi, contractAddressWL);
const contractCM = new web3.eth.Contract(contractCMJson.abi, contractAddressCM);

async function initManage() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    // value: '1000000000000',
    from: PUBLIC_KEY,
    to: contractAddressManager,
    nonce: nonce,
    gas: 1500000,
    // data: nftContract.methods.configTierInfo([
    //   ['1', '10000000000000000000', '5000000000000000000', `${Math.floor(Date.now() / 1000)}`, `${Math.floor(Date.now() / 1000) + 200}`, '8000000000000000000', `${Math.floor(Date.now() / 1000) + 200}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 500}`, '5000000000000000000'],
    // ]).encodeABI(),
    data: contractManager.methods.initialize(
      '0xE4B8f63C111EF118587D30401e1Db99f4CfBD900',
    ).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function addRoleMN() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    // value: '1000000000000',
    from: PUBLIC_KEY,
    to: contractAddressManager,
    nonce: nonce,
    gas: 1500000,
    // data: nftContract.methods.configTierInfo([
    //   ['1', '10000000000000000000', '5000000000000000000', `${Math.floor(Date.now() / 1000)}`, `${Math.floor(Date.now() / 1000) + 200}`, '8000000000000000000', `${Math.floor(Date.now() / 1000) + 200}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 500}`, '5000000000000000000'],
    // ]).encodeABI(),
    data: contractManager.methods.grantRole(
      '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929',
      admin
    ).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function addRoleTier1() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    // value: '1000000000000',
    from: PUBLIC_KEY,
    to: contractAddressTier1,
    nonce: nonce,
    gas: 1500000,
    // data: nftContract.methods.configTierInfo([
    //   ['1', '10000000000000000000', '5000000000000000000', `${Math.floor(Date.now() / 1000)}`, `${Math.floor(Date.now() / 1000) + 200}`, '8000000000000000000', `${Math.floor(Date.now() / 1000) + 200}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 500}`, '5000000000000000000'],
    // ]).encodeABI(),
    data: contractTier1.methods.grantRole(
      '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929',
      admin
    ).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function addRoleTier2() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    // value: '1000000000000',
    from: PUBLIC_KEY,
    to: contractAddressTier2,
    nonce: nonce,
    gas: 1500000,
    // data: nftContract.methods.configTierInfo([
    //   ['1', '10000000000000000000', '5000000000000000000', `${Math.floor(Date.now() / 1000)}`, `${Math.floor(Date.now() / 1000) + 200}`, '8000000000000000000', `${Math.floor(Date.now() / 1000) + 200}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 500}`, '5000000000000000000'],
    // ]).encodeABI(),
    data: contractTier2.methods.grantRole(
      '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929',
      admin
    ).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function addRoleWL() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    // value: '1000000000000',
    from: PUBLIC_KEY,
    to: contractAddressWL,
    nonce: nonce,
    gas: 1500000,
    // data: nftContract.methods.configTierInfo([
    //   ['1', '10000000000000000000', '5000000000000000000', `${Math.floor(Date.now() / 1000)}`, `${Math.floor(Date.now() / 1000) + 200}`, '8000000000000000000', `${Math.floor(Date.now() / 1000) + 200}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 500}`, '5000000000000000000'],
    // ]).encodeABI(),
    data: contractWL.methods.grantRole(
      '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929',
      admin
    ).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function addRoleCM() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    // value: '1000000000000',
    from: PUBLIC_KEY,
    to: contractAddressCM,
    nonce: nonce,
    gas: 1500000,
    // data: nftContract.methods.configTierInfo([
    //   ['1', '10000000000000000000', '5000000000000000000', `${Math.floor(Date.now() / 1000)}`, `${Math.floor(Date.now() / 1000) + 200}`, '8000000000000000000', `${Math.floor(Date.now() / 1000) + 200}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 500}`, '5000000000000000000'],
    // ]).encodeABI(),
    data: contractCM.methods.grantRole(
      '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929',
      admin
    ).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function addRound() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    // value: '1000000000000',
    from: PUBLIC_KEY,
    to: contractAddressManager,
    nonce: nonce,
    gas: 1500000,
    // data: nftContract.methods.configTierInfo([
    //   ['1', '10000000000000000000', '5000000000000000000', `${Math.floor(Date.now() / 1000)}`, `${Math.floor(Date.now() / 1000) + 200}`, '8000000000000000000', `${Math.floor(Date.now() / 1000) + 200}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 500}`, '5000000000000000000'],
    // ]).encodeABI(),
    data: contractManager.methods.addRound([
      contractAddressTier1,
      contractAddressTier2,
      contractAddressWL,
      contractAddressCM
    ]).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function configManager() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    // value: '1000000000000',
    from: PUBLIC_KEY,
    to: contractAddressManager,
    nonce: nonce,
    gas: 1500000,
    // data: nftContract.methods.configTierInfo([
    //   ['1', '10000000000000000000', '5000000000000000000', `${Math.floor(Date.now() / 1000)}`, `${Math.floor(Date.now() / 1000) + 200}`, '8000000000000000000', `${Math.floor(Date.now() / 1000) + 200}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 500}`, '5000000000000000000'],
    // ]).encodeABI(),
    data: contractManager.methods.updateConfig(
      '0xE4B8f63C111EF118587D30401e1Db99f4CfBD900',
      '0x6d3214eFc611aaAC0d87f760fFF3fb441dE389D0',
      '0x0f308999C96caBdBD4755A183Ba2Bf1D21f0c25b',
      '10000000000000000000',
      startLP,
      endLP,
      '500000000000000000000'
    ).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function configTier1() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddressTier1,
    nonce: nonce,
    gas: 1500000,
    data: contractTier1.methods.updateConfig(
      contractAddressManager,
      '50000000000000000000',
      '0',
      '100000000000000000000',
      startBuyTier1,
      endBuyTier1,
      '450000000000000000000',
      startCancelTier1,
      endCancelTier1,
      '5000000000000000000',
      '1'
    ).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function configTier2() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddressTier2,
    nonce: nonce,
    gas: 1500000,
    data: contractTier2.methods.updateConfig(
      contractAddressManager,
      '30000000000000000000',
      '50000000000000000000',
      '80000000000000000000',
      startBuyTier2,
      endBuyTier2,
      '250000000000000000000',
      startCancelTier2,
      endCancelTier2,
      '5000000000000000000',
      '2'
    ).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function configWL() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    // value: '1000000000000',
    from: PUBLIC_KEY,
    to: contractAddressWL,
    nonce: nonce,
    gas: 1500000,
    // data: nftContract.methods.configTierInfo([
    //   ['1', '10000000000000000000', '5000000000000000000', `${Math.floor(Date.now() / 1000)}`, `${Math.floor(Date.now() / 1000) + 200}`, '8000000000000000000', `${Math.floor(Date.now() / 1000) + 200}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 500}`, '5000000000000000000'],
    // ]).encodeABI(),
    data: contractWL.methods.updateConfig(
      contractAddressManager,
      startApplyWL,
      endApplyWL,
      '80000000000000000000',
      startBuyWL,
      endBuyWL,
      '250000000000000000000',
      startBuyWL,
      endBuyWL,
      '5000000000000000000',
    ).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function configCM() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    // value: '1000000000000',
    from: PUBLIC_KEY,
    to: contractAddressCM,
    nonce: nonce,
    gas: 1500000,
    // data: nftContract.methods.configTierInfo([
    //   ['1', '10000000000000000000', '5000000000000000000', `${Math.floor(Date.now() / 1000)}`, `${Math.floor(Date.now() / 1000) + 200}`, '8000000000000000000', `${Math.floor(Date.now() / 1000) + 200}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 300}`, `${Math.floor(Date.now() / 1000) + 500}`, '5000000000000000000'],
    // ]).encodeABI(),
    data: contractCM.methods.updateConfig(
      contractAddressManager,
      '30000000000000000000',
      startBuyCM,
      endBuyCM,
      '150000000000000000000',
      startBuyCM,
      endBuyCM,
      '5000000000000000000',
    ).encodeABI()
  }

  const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
}

async function run() {
  // await initManage()
  // await addRound()
  // await configManager()
  // await configTier1()
  // await configTier2()
  // await configWL()
  await configCM()
  await addRoleMN()
  await addRoleTier1()
  await addRoleTier2()
  await addRoleWL()
  await addRoleCM()
}

run()