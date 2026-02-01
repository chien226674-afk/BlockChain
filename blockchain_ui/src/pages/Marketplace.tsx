import { useState } from "react";
import { Search } from "lucide-react"; // nếu không dùng lucide thì thay bằng svg thường

const tabs = [
  { key: "nfts", label: "NFTs", count: 302 },
  { key: "collections", label: "Collections", count: 67 },
]


const nfts = [
  {
    title: "Magic Mushroom 0325",
    creator: "Shroomie",
    image: "/assets/nft1.png",
  },
  {
    title: "Happy Robot 032",
    creator: "BeKind2Robots",
    image: "/assets/nft2.png",
  },
  {
    title: "Happy Robot 024",
    creator: "BeKind2Robots",
    image: "/assets/nft3.png",
  },
  // thêm data tuỳ bạn
];

export default function BrowseMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
const [activeTab, setActiveTab] = useState("nfts")

  const filteredNFTs = nfts.filter(
    (nft) =>
      nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.creator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#2B2B2B] text-white min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <h1 className="text-4xl font-bold mb-3">Browse Marketplace</h1>
        <p className="text-gray-400 mb-8">
          Browse through more than 50k NFTs on the NFT Marketplace.
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
                  ${
                    activeTab === tab.key
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
          {filteredNFTs.length === 0 ? (
            <p className="text-center text-gray-400">
              No NFTs found 😢
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredNFTs.map((nft) => (
                <div
                  key={nft.title}
                  className="bg-[#2B2B2B] rounded-2xl overflow-hidden hover:scale-105 transition cursor-pointer"
                >
                  <img
                    src={nft.image}
                    alt={nft.title}
                    className="w-full h-72 object-cover"
                  />

                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2">
                      {nft.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <img
                        src="/assets/avatar.png"
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-300">
                        {nft.creator}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-gray-400">Price</p>
                        <p className="font-medium">1.63 ETH</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400">Highest Bid</p>
                        <p className="font-medium">0.33 wETH</p>
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
