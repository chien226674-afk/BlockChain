import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { ethers } from 'ethers';
import { useWallet } from "../context/WalletContext";
import { HOODI_SMART_CONTRACT_ADDRESS } from "../config/contracts";
import NFTMarketplaceABI from "../abis/NFTMarketplace.json";

const tabs = [
  { key: "nfts", label: "NFTs", count: 0 },
  { key: "collections", label: "Collections", count: 0 },
]

interface MarketItem {
  itemId: number;
  tokenId: number;
  seller: string;
  owner: string;
  price: string;
  image: string; // TokenURI
  name?: string;
  description?: string;
  sold: boolean;
}

export default function BrowseMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("nfts");
  const { provider } = useWallet();
  const [nfts, setNfts] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNFTs();
  }, [provider]);

  const loadNFTs = async () => {
    // If no provider (not connected), we can still use a read-only provider if we wanted,
    // but here we simplify to need a provider (or could fallback to public RPC).
    // ideally, use a jsonRpcProvider if wallet not connected.
    let _provider = provider;

    if (!_provider && window.ethereum) {
      // Create temporary provider if not connected
      _provider = new ethers.BrowserProvider(window.ethereum);
    }

    if (!_provider) return;

    try {
      const contract = new ethers.Contract(HOODI_SMART_CONTRACT_ADDRESS, NFTMarketplaceABI, _provider);
      const data = await contract.fetchMarketItems();

      const items = await Promise.all(data.map(async (i: any) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        let price = ethers.formatEther(i.price);

        // In real app, fetch metadata from IPFS here
        // const meta = await axios.get(tokenUri);

        let item: MarketItem = {
          itemId: parseInt(i.itemId),
          price,
          tokenId: parseInt(i.tokenId),
          seller: i.seller,
          owner: i.owner,
          image: tokenUri,
          sold: i.sold,
          name: `NFT #${i.tokenId}`,
          description: "Description"
        };
        return item;
      }));

      setNfts(items);
    } catch (error) {
      console.error("Error loading marketplace:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredNFTs = nfts.filter(
    (nft) =>
      nft.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update count
  tabs[0].count = nfts.length;

  // Buy Function
  const buyNft = async (nft: MarketItem) => {
    if (!provider) {
      alert("Please connect wallet first");
      return;
    }
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(HOODI_SMART_CONTRACT_ADDRESS, NFTMarketplaceABI, signer);

      const price = ethers.parseEther(nft.price);
      const transaction = await contract.buyNFT(nft.itemId, { value: price });

      await transaction.wait();
      alert("Bought successfully!");
      loadNFTs();
    } catch (error) {
      console.error("Error buying NFT:", error);
      alert("Error buying NFT. See console.");
    }
  }

  return (
    <div className="bg-[#2B2B2B] text-white min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <h1 className="text-4xl font-bold mb-3">Browse Marketplace</h1>
        <p className="text-gray-400 mb-8">
          Browse through unique NFTs on the Hoodi Marketplace.
        </p>

        {/* SEARCH */}
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="Search your favourite NFTs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#3B3B3B] rounded-full py-3 pl-5 pr-12 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search
            size={18}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-6 text-center font-medium relative transition
                    ${activeTab === tab.key
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                {tab.label}
                <span className="ml-2 bg-[#3B3B3B] px-2 py-0.5 rounded-full text-sm">
                  {tab.count}
                </span>

                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* ===== NFT GRID ===== */}
      <div className="bg-[#3B3B3B] py-20">
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <div className="text-center text-gray-400">Loading Marketplace...</div>
          ) : filteredNFTs.length === 0 ? (
            <p className="text-center text-gray-400">
              No NFTs found in Marketplace 😢
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredNFTs.map((nft) => (
                <div
                  key={nft.itemId}
                  className="bg-[#2B2B2B] rounded-2xl overflow-hidden hover:scale-105 transition cursor-pointer"
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-72 object-cover"
                  />

                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2">
                      {nft.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <img
                        src="/assets/avatar.png"
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-300">
                        {nft.seller.slice(0, 6)}...{nft.seller.slice(-4)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm items-center">
                      <div>
                        <p className="text-gray-400">Price</p>
                        <p className="font-medium">{nft.price} ETH</p>
                      </div>
                      <div className="text-right">
                        <button
                          onClick={() => buyNft(nft)}
                          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium text-white transition-colors"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
