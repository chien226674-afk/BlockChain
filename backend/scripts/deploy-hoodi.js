import hre from "hardhat";
import fs from "fs";

async function main() {
    console.log("🚀 Deploying to Hoodi Testnet...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("📱 Deployer address:", deployer.address);

    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address); // Fixed for ethers v6/Hardhat compatibility
    console.log("💰 Deployer balance:", hre.ethers.formatEther(balance), "ETH");

    if (balance === 0n) {
        console.log("\n❌ Insufficient funds to deploy!");
        return;
    }

    // Deploy contract
    console.log("\n📦 Deploying NFTMarketplace...");
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    const marketplace = await NFTMarketplace.deploy();

    await marketplace.waitForDeployment(); // Fixed for ethers v6
    const contractAddress = await marketplace.getAddress(); // Fixed for ethers v6

    console.log("✅ Contract deployed to:", contractAddress);

    // Get network info
    const network = await hre.ethers.provider.getNetwork();

    // Save deployment info
    const deploymentInfo = {
        network: "Hoodi Testnet",
        contractAddress: contractAddress,
        deployer: deployer.address,
        deploymentTime: new Date().toISOString(),
        chainId: network.chainId.toString(),
        contractName: "NFTMarketplace",
        // explorerUrl: `https://explorer.hoodi.ethpandaops.io/address/${contractAddress}` // Hypothetical explorer
    };

    fs.writeFileSync(
        "./deployment-hoodi.json",
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("📄 Deployment info saved to deployment-hoodi.json");
    console.log("\n🎉 Deployment completed successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
