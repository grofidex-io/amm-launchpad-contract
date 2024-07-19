const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
require('dotenv').config();

let [owner, addr1, addr2] = [];
let myNFT
beforeEach( async () => {

  [owner, addr1, addr2] = await ethers.getSigners();
  const provider = waffle.provider
  const MyNFT = await ethers.getContractFactory("")
  // Start deployment, returning a promise that resolves to a contract object
  
}); 

describe("", function () {
  it("Test balance ", async function () {
    console.log(await myNFT.balanceOf(owner.address))
  });
});