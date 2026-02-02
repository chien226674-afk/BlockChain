import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import type { NFT } from '../types';
import { useWallet } from '../context/WalletContext';
import { getMarketContract, MARKET_ADDRESS, getNFTContract } from '../services/contract';
import { ethers } from 'ethers';
import { faCoins, faCheckCircle, faClock, faStore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../context/AuthContext';
import MARKET_ABI from '../../../smart_contracts/artifacts/contracts/Marketplace.sol/Marketplace.json';

const NFTDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  // const [allowance, setAllowance] = useState<bigint>(0n);
  const [balance, setBalance] = useState<string>("0");
  const { account, signer } = useWallet();

  // Listing state
  const [isListing, setIsListing] = useState(false);
  const [listPrice, setListPrice] = useState('');
  const [listingStatus, setListingStatus] = useState('');

  useEffect(() => {
    if (id) fetchNFT(id);
  }, [id]);

  useEffect(() => {
    if (signer && account) {
      checkAllowanceAndBalance();
    }
  }, [signer, account, nft]);

  const checkAllowanceAndBalance = async () => {
    try {
      const balanceWei = await signer!.provider!.getBalance(account!);
      setBalance(ethers.formatEther(balanceWei));
    } catch (error) {
      console.error("Failed to check balance", error);
    }
  };

  const fetchNFT = async (tokenId: string) => {
    try {
      const { data } = await api.get(`/nfts/${tokenId}`);
      setNft(data);
    } catch (error) {
      console.error("Failed to fetch NFT", error);
    } finally {
      setLoading(false);
    }
  };

  // Removed handleApprove as it is not needed for Native Token

  const handleBuy = async () => {
    if (!nft || !nft.price || !signer) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setProcessing(true);
      const contract = await getMarketContract(signer);
      const itemId = (nft as any).itemId;
      const priceInWei = ethers.parseEther(nft.price.toString());

      if (!itemId) {
        alert("This NFT is not currently listed with an Item ID.");
        return;
      }

      console.log("Purchasing item:", itemId, "for price:", nft.price, "GO");

      // Purchase item - Sending VALUE (Native Token)
      const tx = await contract.purchaseItem(itemId, {
        value: priceInWei,
        gasLimit: 500000
      });

      await tx.wait();

      // Sync with backend
      try {
        await api.post(`/nfts/${nft.tokenId}/buy`, {
          buyerAddress: account
        });
      } catch (syncError) {
        console.error("Backend sync failed", syncError);
        // We don't alert here as the purchase on-chain was successful
      }

      alert("NFT Purchased Successfully!");
      fetchNFT(nft.tokenId);
      checkAllowanceAndBalance();
    } catch (error: any) {
      console.error("Buy failed", error);
      let message = error.message;
      if (error.data && error.data.message) message = error.data.message;
      if (error.reason) message = error.reason;

      alert("Purchase failed: " + message);
    } finally {
      setProcessing(false);
    }
  };

  const handleListForSale = async () => {
    if (!signer || !nft) {
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
      setIsListing(false);
      setListPrice('');
      setListingStatus('');
      fetchNFT(nft.tokenId); // Refresh NFT data
    } catch (error: any) {
      console.error("Listing failed", error);
      alert("Listing failed: " + (error.reason || error.message));
      setListingStatus('');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!nft) return <div>NFT not found</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full rounded-xl shadow-lg"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=NFT+Image'; }}
        />
        <div>
          <h1 className="text-4xl font-bold mb-4">{nft.name}</h1>
          <p className="text-gray-500 mb-6">{nft.description}</p>

          <div className="bg-[#2B2B2B] p-6 rounded-xl border border-gray-700 shadow-inner">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-400">Current Price</p>
              {account && (
                <div className="text-[10px] text-purple-400 flex items-center gap-1">
                  <FontAwesomeIcon icon={faCoins} />
                  <span>Your Balance: {Number(balance).toLocaleString()} GO</span>
                </div>
              )}
            </div>

            <p className="text-3xl font-bold mb-6 text-white">
              {nft.itemId && nft.itemId !== "null" ? `${nft.price} GO` : 'Not Listed'}
            </p>

            {/* If NFT is listed */}
            {(nft.itemId && nft.itemId !== "null") && (
              <div className="space-y-3">
                {account?.toLowerCase() === (nft.owner as any)?.walletAddress?.toLowerCase() ? (
                  <div className="bg-purple-900/40 text-purple-200 p-4 rounded-lg text-center font-semibold border border-purple-700/50">
                    You already own this NFT
                  </div>
                ) : (
                  <button
                    onClick={handleBuy}
                    disabled={processing}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processing ? (
                      <><FontAwesomeIcon icon={faClock} className="animate-spin" /> Processing...</>
                    ) : (
                      <><FontAwesomeIcon icon={faCheckCircle} /> Buy Now with GO</>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* If NFT is NOT listed and user is the owner */}
            {(!nft.itemId || nft.itemId === "null") && account?.toLowerCase() === (nft.owner as any)?.walletAddress?.toLowerCase() && (
              <div className="space-y-3">
                {!isListing ? (
                  <button
                    onClick={() => setIsListing(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faStore} /> List for Sale
                  </button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Price in CBS (e.g., 100)"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-purple-500"
                      value={listPrice}
                      onChange={(e) => setListPrice(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleListForSale}
                        disabled={!!listingStatus}
                        className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-50"
                      >
                        {listingStatus ? "Processing..." : "Confirm List"}
                      </button>
                      <button
                        onClick={() => { setIsListing(false); setListingStatus(''); setListPrice(''); }}
                        className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-500 transition"
                      >
                        Cancel
                      </button>
                    </div>
                    {listingStatus && (
                      <p className="text-xs text-yellow-400 animate-pulse text-center">
                        {listingStatus}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* If NFT is NOT listed and user is NOT the owner */}
            {(!nft.itemId || nft.itemId === "null") && account?.toLowerCase() !== (nft.owner as any)?.walletAddress?.toLowerCase() && (
              <div className="bg-gray-700/50 text-gray-300 p-4 rounded-lg text-center">
                This NFT is not currently listed for sale
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailPage;
