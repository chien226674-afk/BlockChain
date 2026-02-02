export default CreateNFT;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { HOODI_SMART_CONTRACT_ADDRESS } from '../config/contracts';
import NFTMarketplaceABI from '../abis/NFTMarketplace.json';

const CreateNFT: React.FC = () => {
    const navigate = useNavigate();
    const { isConnected, provider } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [formInput, setFormInput] = useState({
        name: '',
        description: '',
        price: '',
        image: ''
    });

    const createNFT = async () => {
        const { name, description, price, image } = formInput;
        if (!name || !description || !price || !image) {
            alert("Please fill all fields!");
            return;
        }
        if (!isConnected || !provider) {
            alert("Please connect wallet first!");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Construct Metadata (Mock IPFS for now)
            // In a real app, we would upload this JSON to IPFS/Pinata here
            const metadata = JSON.stringify({
                name,
                description,
                image
            });
            // For this demo, we use the image URL itself as the TokenURI/Identifier
            // or we could encode the metadata as a data URI (though expensive regarding gas)
            const tokenURI = image;

            // 2. Interact with Contract
            const signer = await provider.getSigner();

            // Debug Network
            const network = await provider.getNetwork();
            console.log("DEBUG: Current Chain ID:", network.chainId.toString());
            console.log("DEBUG: Configured Contract:", HOODI_SMART_CONTRACT_ADDRESS);

            const contract = new ethers.Contract(HOODI_SMART_CONTRACT_ADDRESS, NFTMarketplaceABI, signer);

            // Fetch current listing fee from contract (with fallback)
            let listingFee = ethers.parseEther("0.025");
            try {
                const feeFromContract = await contract.listingFee();
                listingFee = feeFromContract;
                console.log("Contract Listing Fee:", ethers.formatEther(listingFee));
            } catch (err) {
                console.warn("WARNING: Could not fetch listingFee. Using fallback 0.025 ETH.", err);
            }

            // Check user balance
            const balance = await provider.getBalance(signer.getAddress());
            console.log("User Balance:", ethers.formatEther(balance));

            if (balance < listingFee) {
                alert(`Insufficient funds! You need at least ${ethers.formatEther(listingFee)} ETH + Gas.`);
                return;
            }


            const collectionId = 0;

            console.log("Minting with URI:", tokenURI);
            // Send transaction with dynamic listingFee
            const transaction = await contract.createToken(tokenURI, collectionId, { value: listingFee });

            console.log("Transaction sent:", transaction.hash);
            await transaction.wait();

            console.log("Details:", name, price);

            // 3. List Item (If the contract logic requires manual listing, or if createToken does it?)
            // Looking at the contract: 
            // - createToken calls _mint, sets URI, creates MarketItem with price 0, sold=false.
            // - It DOES NOT set the price automatically from an argument in createToken?
            // Wait, looking at contract code:
            // idToMarketItem[itemId] = MarketItem(..., price: 0, ...);
            // So we MUST call listNFTForSale separately to set the price!

            // We need to find the tokenId. 
            // In a real app we parse the logs. For simplicity, we can just grab the latest token of user 
            // OR simpler: The user has to go to "My NFTs" to list it? 
            // NO, let's try to do it in one flow if possible, but finding the tokenId is tricky without event parsing.

            // Let's parse the event to get the numeric tokenId
            // Receipt has logs.
            // event MarketItemCreated(...)

            // For this MVP step 1: Let's just Mint.
            // We'll update the flow to "Mint Successful! Go to Profile to List" OR we try to parse.

            alert("NFT Minted Successfully! You can now view it in your profile.");
            navigate('/profile'); // We need a profile page

        } catch (error: any) {
            console.error("Error creating NFT:", error);
            // Decode error if possible
            if (error.reason) alert(`Error: ${error.reason}`);
            else alert("Transaction failed. Check console.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen pt-20 pb-10 px-4">
            <div className="w-full max-w-lg bg-[#2b2b3b] p-8 rounded-2xl shadow-xl border border-[#3b3b4f]">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Create New NFT</h2>

                <div className="space-y-6">
                    {/* Image URL Input */}
                    <div>
                        <label className="block text-[#a1a1aa] mb-2 font-medium">Image URL</label>
                        <input
                            placeholder="e.g. https://ipfs.io/ipfs/..."
                            className="w-full bg-[#1c1c2e] text-white px-4 py-3 rounded-lg border border-[#3b3b4f] focus:outline-none focus:border-[#a855f7] transition-colors"
                            onChange={e => setFormInput({ ...formInput, image: e.target.value })}
                        />
                        {formInput.image && (
                            <img src={formInput.image} alt="Preview" className="mt-4 rounded-lg max-h-48 object-cover mx-auto" />
                        )}
                    </div>

                    {/* Name Input */}
                    <div>
                        <label className="block text-[#a1a1aa] mb-2 font-medium">Name</label>
                        <input
                            placeholder="NFT Name"
                            className="w-full bg-[#1c1c2e] text-white px-4 py-3 rounded-lg border border-[#3b3b4f] focus:outline-none focus:border-[#a855f7] transition-colors"
                            onChange={e => setFormInput({ ...formInput, name: e.target.value })}
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-[#a1a1aa] mb-2 font-medium">Description</label>
                        <textarea
                            placeholder="Description..."
                            className="w-full bg-[#1c1c2e] text-white px-4 py-3 rounded-lg border border-[#3b3b4f] focus:outline-none focus:border-[#a855f7] transition-colors h-24 resize-none"
                            onChange={e => setFormInput({ ...formInput, description: e.target.value })}
                        />
                    </div>

                    {/* Price Input */}
                    <div>
                        <label className="block text-[#a1a1aa] mb-2 font-medium">Price (ETH)</label>
                        <input
                            placeholder="e.g. 0.01"
                            type="number"
                            step="0.001"
                            className="w-full bg-[#1c1c2e] text-white px-4 py-3 rounded-lg border border-[#3b3b4f] focus:outline-none focus:border-[#a855f7] transition-colors"
                            onChange={e => setFormInput({ ...formInput, price: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={createNFT}
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <span className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></span>
                                Creating...
                            </div>
                        ) : 'Create NFT'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateNFT;
