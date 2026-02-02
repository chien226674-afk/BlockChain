import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { NFT } from '../types';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { getNFTContract, getMarketContract, MARKET_ADDRESS } from '../services/contract';
import { ethers } from 'ethers';
import MARKET_ABI from '../../../smart_contracts/artifacts/contracts/Marketplace.sol/Marketplace.json';
import { faWallet, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserProfile = () => {
    const { user } = useAuth();
    const { account, ethAddress, signer } = useWallet() as any; // account or ethAddress depending on version
    const walletAccount = account || ethAddress;
    const [ownedNfts, setOwnedNfts] = useState<NFT[]>([]);
    const [loading, setLoading] = useState(true);
    const [listingNftId, setListingNftId] = useState<string | null>(null);
    const [listPrice, setListPrice] = useState('');
    const [listingStatus, setListingStatus] = useState('');

    const handleListForSale = async (nft: NFT) => {
        if (!signer) {
            alert("Please connect your wallet");
            return;
        }
        if (!listPrice || isNaN(Number(listPrice)) || Number(listPrice) <= 0) {
            alert("Please enter a valid price greater than 0");
            return;
        }

        try {
            setListingStatus("Approving Marketplace...");
            const nftContract = await getNFTContract(signer);
            const approveTx = await nftContract.setApprovalForAll(MARKET_ADDRESS, true, { gasLimit: 300000 });
            await approveTx.wait();

            setListingStatus("Listing on Marketplace...");
            const marketContract = await getMarketContract(signer);
            const priceInWei = ethers.parseEther(listPrice);
            const listTx = await marketContract.makeItem(await nftContract.getAddress(), nft.tokenId, priceInWei, { gasLimit: 300000 });
            const listReceipt = await listTx.wait();

            // Extract itemId from Offered event
            const marketInterface = new ethers.Interface(MARKET_ABI.abi);
            let itemId = null;
            for (const log of listReceipt.logs) {
                try {
                    const parsedLog = marketInterface.parseLog(log as any);
                    if (parsedLog && parsedLog.name === 'Offered') {
                        itemId = parsedLog.args.itemId.toString();
                        break;
                    }
                } catch (e) { }
            }

            setListingStatus("Syncing with backend...");
            await api.patch(`/nfts/${nft.tokenId}`, {
                price: Number(listPrice),
                itemId: itemId
            });

            alert("NFT Listed Successfully!");
            setListingNftId(null);
            setListPrice('');
            setListingStatus('');
            fetchUserNFTs();
        } catch (error: any) {
            console.error("Listing failed", error);
            alert("Listing failed: " + (error.reason || error.message));
            setListingStatus('');
        }
    };

    useEffect(() => {
        if (user?.walletAddress) {
            fetchUserNFTs();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchUserNFTs = async () => {
        try {
            // Assuming backend has endpoints for this, or we filter from all NFTs
            // For now, let's fetch all and filter client-side if specific endpoints don't exist
            // Or better, let's assume we can fetch by creator/owner
            const { data } = await api.get('/nfts'); // This gets all. 
            // In a real app, we'd use /nfts?owner=address or similar.
            // Filtering client side for demo purposes since backend might be simple

            // Filter NFTs by owner
            const owned = data.filter((nft: any) => {
                const nftOwnerWallet = nft.owner?.walletAddress?.toLowerCase();
                const userWallet = user?.walletAddress?.toLowerCase();
                const nftOwnerId = nft.owner?._id || nft.owner;
                const userId = (user as any)._id || (user as any).id;

                return (nftOwnerWallet && nftOwnerWallet === userWallet) ||
                    (nftOwnerId && String(nftOwnerId) === String(userId));
            });

            setOwnedNfts(owned);
        } catch (error) {
            console.error("Failed to fetch user NFTs", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="text-center py-20 text-white">Please login to view profile</div>;

    return (
        <div className="container mx-auto py-10 px-4 text-white">
            {/* Profile Header */}
            <div className="bg-[#2B2B2B] rounded-xl p-8 mb-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-600">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-4xl font-bold">
                            {user.username ? user.username[0].toUpperCase() : 'U'}
                        </div>
                    )}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">{user.username || 'User'}</h1>
                    <p className="text-gray-400 font-mono mb-2">{user.walletAddress || "No Wallet Connected"}</p>
                    {user.bio && <p className="text-gray-300 italic mb-4 max-w-md">"{user.bio}"</p>}

                    {/* Link Wallet Call to Action */}
                    {!user.walletAddress && walletAccount && (
                        <div className="mb-6 p-4 bg-purple-600/20 border border-purple-500/50 rounded-lg flex flex-col items-center md:items-start gap-3">
                            <div className="flex items-center gap-2 text-purple-400 font-bold">
                                <FontAwesomeIcon icon={faWallet} />
                                <span>Wallet Detected: {walletAccount.slice(0, 6)}...{walletAccount.slice(-4)}</span>
                            </div>
                            <p className="text-sm text-gray-300 text-center md:text-left">This wallet is connected to your browser but not linked to your profile. Please link it to see your NFTs.</p>
                            <Link to="/connect-wallet" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold flex items-center gap-2 transition text-sm">
                                <FontAwesomeIcon icon={faLink} />
                                Verify & Link Wallet Now
                            </Link>
                        </div>
                    )}

                    <div className="flex gap-4 justify-center md:justify-start">
                        <Link to="/user/edit-profile" className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 font-semibold">
                            Edit Profile
                        </Link>
                        <Link to="/create-nft" className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700 font-semibold">
                            Create NFT
                        </Link>
                    </div>
                </div>
            </div>

            {/* NFT Tabs */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Your Collection</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {ownedNfts.length === 0 ? (
                            <p className="text-gray-500 col-span-full">You don't own any NFTs yet.</p>
                        ) : (
                            ownedNfts.map((nft) => (
                                <div key={nft._id} className="bg-[#2B2B2B] rounded-xl overflow-hidden hover:-translate-y-1 transition duration-300">
                                    <img src={nft.image} alt={nft.name} className="w-full h-64 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg truncate">{nft.name}</h3>
                                        <div className="flex flex-col gap-2 mt-2">
                                            <Link to={`/nft-detail/${nft.tokenId}`} className="text-purple-400 text-sm hover:underline">View Details</Link>

                                            {(!nft.itemId || nft.itemId === "null") ? (
                                                <div className="mt-2">
                                                    {listingNftId === nft._id ? (
                                                        <div className="flex flex-col gap-2">
                                                            <input
                                                                type="number"
                                                                placeholder="Price (GO)"
                                                                className="bg-gray-800 border border-gray-600 rounded p-1 text-sm outline-none"
                                                                value={listPrice}
                                                                onChange={(e) => setListPrice(e.target.value)}
                                                            />
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleListForSale(nft)}
                                                                    className="bg-purple-600 text-xs py-1 px-2 rounded hover:bg-purple-700 flex-1"
                                                                    disabled={!!listingStatus}
                                                                >
                                                                    {listingStatus ? "Processing..." : "Confirm List"}
                                                                </button>
                                                                <button
                                                                    onClick={() => { setListingNftId(null); setListingStatus(''); }}
                                                                    className="bg-gray-600 text-xs py-1 px-2 rounded hover:bg-gray-500"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                            {listingStatus && <p className="text-[10px] text-yellow-400 animate-pulse">{listingStatus}</p>}
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setListingNftId(nft._id)}
                                                            className="w-full bg-blue-600 text-sm py-1 rounded hover:bg-blue-700 transition"
                                                        >
                                                            List for Sale
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="mt-2">
                                                    <span className="text-green-400 text-sm font-bold">Listed for {nft.price} GO</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
