const hre = require("hardhat");

async function main() {
  const marketAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.attach(marketAddress);

  const fs = require("fs");
  let output = "";
  try {
    const itemCount = await marketplace.itemCount();
    output += `Total Item Count in Contract: ${itemCount.toString()}\n`;

    for (let i = 1; i <= Number(itemCount); i++) {
        try {
            const item = await marketplace.items(i);
            output += `--- Item ${i} ---\n`;
            output += `Token ID: ${item.tokenId.toString()}\n`;
            output += `Sold Status: ${item.sold}\n`;
            output += `Price: ${hre.ethers.formatEther(item.price)} GO\n`;
            output += `Seller: ${item.seller}\n`;
        } catch (e) {
            output += `--- Item ${i} FAILED: ${e.message} ---\n`;
        }
    }
  } catch (error) {
    output += `CRITICAL ERROR: ${error.message}\n`;
  }
  
  fs.writeFileSync("item_details.txt", output);
  console.log("Details written to item_details.txt");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
