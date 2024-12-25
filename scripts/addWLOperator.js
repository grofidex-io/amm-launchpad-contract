require("dotenv").config();
const path = require("path");
const API_URL = process.env.NEL_URL;
const PUBLIC_KEY = "0x74DA0302670D897dd3E1c9A1771B6844BFA5C318";
const PRIVATE_KEY = 'CAB05818A64EDBCAF098D515006ABCAD6AF87C7792541D4A72DC83A719B372BA';
const fs = require('fs')


const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
// const inboxPath = path.resolve(__dirname, 'contracts','MyNFT.json', 'MyNFT.json');
const contract = require("../artifacts/contracts/LaunchpadRoundWhitelistPrivate.sol/LaunchpadRoundWhitelistPrivate.json");
const contractAddress = "0xDE1C174b435880E348740CAB8ba3e0e1b081c34d";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
const tmpAddressesFilepath = `./whitelist.json`

function readTmpAddresses() {
  return JSON.parse(fs.readFileSync(tmpAddressesFilepath))
}

async function configManager() {
  const totalElements = readTmpAddresses().length;
  // const totalElements = 943;

  const chunkSize = 200;
  let startIndex = 0;

  while (startIndex < totalElements) {
    // Define the end index for the current chunk
    const endIndex = Math.min(startIndex + chunkSize, totalElements);

    // Process the current chunk
    console.log(`Processing elements ${startIndex} to ${endIndex - 1}`);
    let users = []
    for (let i = startIndex; i < endIndex; i ++) {
      users.push(readTmpAddresses()[i])
    }
    console.log(users.length)

    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
    console.log('nonce: '+ nonce)
    const esgas = await web3.eth.estimateGas({
      from: PUBLIC_KEY,
      to: contractAddress,
      nonce: nonce,
      data: nftContract.methods.addToWhitelistByOperator(
        users
      ).encodeABI()
    })
    const tx = {
      from: PUBLIC_KEY,
      to: contractAddress,
      nonce: nonce,
      gas: esgas,
      data: nftContract.methods.addToWhitelistByOperator(
        users
      ).encodeABI()
    }
  
    const signPromise = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    let hash = await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
    await checkTransactionConfirmations(hash.transactionHash)
    // Simulate processing by slicing an array, or add your processing logic here
    // const chunk = array.slice(startIndex, endIndex);
    // processChunk(chunk);

    // Move to the next chunk
    // await delay(2000)
    startIndex += chunkSize;
  }
}
async function checkTransactionConfirmations(txHash, requiredConfirmations = 3) {
  let receipt = null;

  while (true) {
    try {
      receipt = await web3.eth.getTransactionReceipt(txHash);

      if (receipt && receipt.blockNumber) {
        // Calculate the number of confirmations
        const currentBlock = await web3.eth.getBlockNumber();
        const confirmations = currentBlock - receipt.blockNumber;

        // console.log(`Confirmations: ${confirmations}`);

        if (confirmations >= requiredConfirmations) {
          // console.log('Transaction is confirmed');
          break; // Exit loop when required confirmations are reached
        }
      } else {
        // console.log('Waiting for transaction to be mined...');
      }

      // Delay between checks (e.g., 1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error('Error checking confirmations:', error);
      break;
    }
  }
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

configManager()