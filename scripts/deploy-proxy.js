async function main() {
  const MyNFT = await ethers.getContractFactory("TransparentUpgradeableProxy");

  // Start deployment, returning a promise that resolves to a contract object
  const myNFT = await MyNFT.deploy(
    "0x9C0DB5A44dE7933ab8780e67753a87345c238BA8",
    "0xFeE6cF659E522315f63703f9b9D42b81cB8f72dC",
    "0x"
  );
  // const myNFT = await MyNFT.deploy('0x8DFcF2a8bcB5bfECD91083af72e548E6da34e411', '0x3D84c3065c667b29b05C8F685cD589CCCd70c3cC')
  await myNFT.deployed();
  console.log("Contract Manager address:", myNFT.address);

  const roundTier = await ethers.getContractFactory("LaunchPadRoundTier");

  // Start deployment, returning a promise that resolves to a contract object
  const tier1 = await roundTier.deploy(
    "0xE4B8f63C111EF118587D30401e1Db99f4CfBD900"
  );
  await tier1.deployed();
  console.log("Contract tier1 address:", tier1.address);
  const tier2 = await roundTier.deploy(
    "0xE4B8f63C111EF118587D30401e1Db99f4CfBD900"
  );
  await tier2.deployed();
  console.log("Contract tier1 address:", tier2.address);

  const roundWL = await ethers.getContractFactory("LaunchPadRoundWhiteList");

  // Start deployment, returning a promise that resolves to a contract object
  const wl = await roundWL.deploy(
    "0xE4B8f63C111EF118587D30401e1Db99f4CfBD900"
  );
  await wl.deployed();
  console.log("Contract WL address:", wl.address);

  const roundCM = await ethers.getContractFactory("LaunchPadRoundCommunity");

  // Start deployment, returning a promise that resolves to a contract object
  const cm = await roundCM.deploy(
    "0xE4B8f63C111EF118587D30401e1Db99f4CfBD900"
  );
  await cm.deployed();
  console.log("Contract WL address:", cm.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
