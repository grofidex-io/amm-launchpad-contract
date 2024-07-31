async function main() {
  const MyNFT = await ethers.getContractFactory("FactoryLaunchpadRound");

  // Start deployment, returning a promise that resolves to a contract object
  const myNFT = await MyNFT.deploy(
    "0x3BDBDa6E1710d814B6142c1109cb786D4cE169FC"
  );
  await myNFT.deployed();
  console.log("Contract deployed to address:", myNFT.address);
  await hre.run(`verify:verify`, {
    address: myNFT.address,
    constructorArguments: ['0x3BDBDa6E1710d814B6142c1109cb786D4cE169FC'],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
