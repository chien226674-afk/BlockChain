const hre = require("hardhat");

async function main() {
  const nftAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const marketAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  console.log("Checking status on network:", hre.network.name);

  const nftCode = await hre.ethers.provider.getCode(nftAddress);
  if (nftCode === "0x") {
    console.log("NFT Contract NOT found at", nftAddress);
  } else {
    console.log("NFT Contract FOUND at", nftAddress);
  }

  const marketCode = await hre.ethers.provider.getCode(marketAddress);
  if (marketCode === "0x") {
    console.log("Marketplace Contract NOT found at", marketAddress);
  } else {
    console.log("Marketplace Contract FOUND at", marketAddress);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
