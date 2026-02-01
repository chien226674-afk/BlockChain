const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying to Mezo Testnet...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("📱 Deployer address:", deployer.address);
  
  // Kiểm tra balance trước
  const balance = await deployer.getBalance();
  console.log("💰 Deployer balance:", hre.ethers.utils.formatEther(balance), "BTC");
  
  if (balance.eq(0)) {
    console.log("\n❌ Không đủ BTC để deploy!");
    console.log("👉 Lấy testnet BTC từ: https://www.mezo.org/faucet");
    return;
  }
  
  // Deploy contract
  console.log("\n📦 Deploying BitcoinNFTMarketplace...");
  const BitcoinNFTMarketplace = await hre.ethers.getContractFactory("BitcoinNFTMarketplace");
  const marketplace = await BitcoinNFTMarketplace.deploy();
  
  await marketplace.deployed();
  
  console.log("✅ Contract deployed to:", marketplace.address);
  
  // Lấy thông tin network
  const network = await hre.ethers.provider.getNetwork();
  
  // Lưu thông tin deployment
  const deploymentInfo = {
    network: "Mezo Testnet",
    contractAddress: marketplace.address,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    chainId: network.chainId,
    contractName: "BitcoinNFTMarketplace",
    explorerUrl: `https://explorer.mezo.org/address/${marketplace.address}`
  };
  
  fs.writeFileSync(
    "./deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("📄 Deployment info saved to deployment-info.json");
  
  // Lấy listing price
  const listingPrice = await marketplace.getListingPrice();
  console.log("🏷️ Listing price:", hre.ethers.utils.formatEther(listingPrice), "BTC");
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("🔗 Explorer:", deploymentInfo.explorerUrl);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });