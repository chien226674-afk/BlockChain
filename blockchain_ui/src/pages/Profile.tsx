import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { HOODI_SMART_CONTRACT_ADDRESS } from '../config/contracts';
import NFTMarketplaceABI from '../abis/NFTMarketplace.json';

// Define NFT Type
interface NFTItem {
    tokenId: number;
    price: string;
    seller: string;
    owner: string;
    image: string;
    sold: boolean;
    name?: string;
    description?: string;
}

const Profile: React.FC = () => {
    const { isConnected, provider, account } = useWallet();
    const [nfts, setNfts] = useState<NFTItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Listing State
    const [sellingNft, setSellingNft] = useState<NFTItem | null>(null);
    const [priceInput, setPriceInput] = useState('');
    const [isListing, setIsListing] = useState(false);

    useEffect(() => {
        if (isConnected && provider) {
            loadMyNFTs();
        }
    }, [isConnected, provider]);

    const loadMyNFTs = async () => {
        setIsLoading(true);
        try {
            const signer = await provider!.getSigner();
            const contract = new ethers.Contract(HOODI_SMART_CONTRACT_ADDRESS, NFTMarketplaceABI, signer);

            // 1. Fetch raw items from contract
            const data = await contract.fetchMyNFTs();

            // 2. Format items (fetch tokenURI for image)
            const items = await Promise.all(data.map(async (i: any) => {
                const tokenUri = await contract.tokenURI(i.tokenId);
                // In our implementation, tokenURI is the Image URL directly. 
                // If it was IPFS JSON, we would fetch it here.

                let price = ethers.formatEther(i.price);

                let item: NFTItem = {
                    price,
                    tokenId: parseInt(i.tokenId),
                    seller: i.seller,
                    owner: i.owner,
                    image: tokenUri,
                    sold: i.sold
                };
                return item;
            }));

            setNfts(items);
        } catch (error) {
            console.error("Error fetching NFTs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleListForSale = async () => {
        if (!sellingNft || !priceInput) return;

        try {
            setIsListing(true);
            const signer = await provider!.getSigner();
            const contract = new ethers.Contract(HOODI_SMART_CONTRACT_ADDRESS, NFTMarketplaceABI, signer);

            const price = ethers.parseEther(priceInput);
            const transaction = await contract.listNFTForSale(sellingNft.tokenId, price);

            await transaction.wait();

            alert("NFT Listed Successfully!");
            setSellingNft(null);
            setPriceInput('');
            loadMyNFTs(); // Reload

        } catch (error) {
            console.error("Error listing NFT:", error);
            alert("Error listing NFT. Check console.");
        } finally {
            setIsListing(false);
        }
    };

    if (!isConnected) return (
        <div className="flex justify-center items-center h-screen bg-[#2b2b3b] text-white">
            <h2 className="text-2xl">Please connect your wallet to view your profile</h2>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#2b2b3b] text-white pt-20 px-6 pb-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <img src="/assets/avatar.png" className="w-20 h-20 rounded-full border-4 border-purple-500 mr-6" alt="Avatar" />
                    <div>
                        <h1 className="text-3xl font-bold">My Collection</h1>
                        <p className="text-gray-400 mt-1">{account?.slice(0, 6)}...{account?.slice(-4)}</p>
                    </div>
                </div>

                {/* NFT Grid */}
                {isLoading ? (
                    <div className="text-center py-20">Loading assets...</div>
                ) : nfts.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl mb-4">No NFTs found</p>
                        <a href="/create" className="text-purple-400 hover:underline">Create your first NFT</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {nfts.map((nft) => (
                            <div key={nft.tokenId} className="bg-[#1c1c2e] rounded-xl overflow-hidden border border-[#3b3b4f] hover:shadow-2xl transition-all">
                                <img src={nft.image} alt="NFT" className="w-full h-64 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1">NFT #{nft.tokenId}</h3>
                                    <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                                        <span>Price</span>
                                        <span className="text-white font-medium">{nft.price === '0.0' ? 'Not Listed' : `${nft.price} ETH`}</span>
                                    </div>

                                    {/* Action Buttons */}
                                    {nft.price === '0.0' ? (
                                        <button
                                            onClick={() => setSellingNft(nft)}
                                            className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                                        >
                                            List for Sale
                                        </button>
                                    ) : (
                                        <button className="w-full py-2 bg-gray-700 text-gray-400 cursor-not-allowed rounded-lg font-medium">
                                            Listed
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Listing Modal */}
                {sellingNft && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                        <div className="bg-[#2b2b3b] p-8 rounded-2xl max-w-sm w-full border border-[#3b3b4f]">
                            <h3 className="text-2xl font-bold mb-4">List NFT for Sale</h3>
                            <p className="text-gray-400 mb-6">Set a price for NFT #{sellingNft.tokenId}</p>

                            <label className="block text-sm font-medium text-gray-300 mb-2">Price (ETH)</label>
                            <input
                                type="number"
                                autoFocus
                                value={priceInput}
                                onChange={e => setPriceInput(e.target.value)}
                                className="w-full bg-[#1c1c2e] border border-[#3b3b4f] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 mb-6"
                                placeholder="0.01"
                            />

                            <div className="flex gap-4">
                                <button
                                    onClick={() => { setSellingNft(null); setPriceInput(''); }}
                                    className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleListForSale}
                                    disabled={isListing}
                                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 rounded-lg font-bold"
                                >
                                    {isListing ? 'Processing...' : 'Confirm Listing'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
