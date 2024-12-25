async function main() {
  const MyNFT = await ethers.getContractFactory("LaunchpadRoundWhitelistPrivate");

  // Start deployment, returning a promise that resolves to a contract object
  const myNFT = await MyNFT.deploy(
    "0x2948510f9443382CA95919582Fa9bbB21eF1F7f8"
  );
  await myNFT.deployed();
  console.log("Contract deployed to address:", myNFT.address);
  await hre.run(`verify:verify`, {
    address: myNFT.address,
    constructorArguments: ['0x2948510f9443382CA95919582Fa9bbB21eF1F7f8'],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
