import { ethers } from 'ethers';
import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import NFT from './models/NFT.js';

dotenv.config();

// Contract Details
const NFT_ADDRESS = "0x24d38D8C7B979c3779ae6e43DBB37eDcb3Ba6F6a";
const USER_WALLET = "0x8256E30bC5058762Dd891eC98cb84a58C28BFd51";

// Load ABI
const nftAbiPath = '../smart_contracts/artifacts/contracts/NFT.sol/NFT.json';
const nftArtifact = JSON.parse(fs.readFileSync(nftAbiPath, 'utf8'));
const nftAbi = nftArtifact.abi;

async function verifyBlockchainIDs() {
    try {
        console.log('🔌 Connecting to Localhost Blockchain...');
        // Connect to local hardhat node (Ethers v5 syntax)
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
        
        const network = await provider.getNetwork();
        console.log(`✅ Connected to network: ${network.name} (chainId: ${network.chainId})`);
        
        const nftContract = new ethers.Contract(NFT_ADDRESS, nftAbi, provider);
        
        // Connect to MongoDB to get tokenIds to check
        await mongoose.connect(process.env.MONGO_URI);
        const nfts = await NFT.find({ owner: { $ne: null } }).populate('owner');
        
        console.log(`\n📋 Checking ${nfts.length} NFTs from database against Blockchain state:\n`);
        
        let invalidCount = 0;

        for (const nft of nfts) {
            const tokenId = nft.tokenId; 
            // Skip non-numeric tokenIds (demos) if any remain
            if (isNaN(parseInt(tokenId))) continue;

            process.stdout.write(`   Token ID [${tokenId}] (${nft.name}): `);
            
            try {
                const owner = await nftContract.ownerOf(tokenId);
                
                if (owner.toLowerCase() === USER_WALLET.toLowerCase()) {
                    console.log(`✅ EXISTS & OWNED by User`);
                } else {
                    console.log(`⚠️  EXISTS but Owned by: ${owner}`);
                    console.log(`      (User Wallet: ${USER_WALLET})`);
                }
            } catch (error) {
                console.log(`❌ DOES NOT EXIST on Blockchain (Reverted)`);
                invalidCount++;
            }
        }
        
        console.log('\n' + '═'.repeat(60));
        if (invalidCount > 0) {
            console.log(`\n🚨 CRITICAL ISSUE FOUND: ${invalidCount} NFTs exist in DB but NOT on Blockchain.`);
            console.log("   This causes 'transaction reverted' errors because you cannot list/approve items that don't exist.");
            console.log("   Solution: You must CREATE NEW NFTs via the 'Create NFT' page.");
        } else {
            console.log("\n✅ All NFTs are valid on blockchain.");
        }
        
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

verifyBlockchainIDs();
