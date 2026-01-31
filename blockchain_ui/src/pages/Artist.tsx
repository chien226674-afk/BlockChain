import { useState } from "react"
import ImgHeader from "@/assets/image1.png"
import Imgavt from "@/assets/image.png"
const tabs = [
  { key: "created", label: "Created", count: 302 },
  { key: "owned", label: "Owned", count: 67 },
  { key: "collection", label: "Collection", count: 4 },
]

const nfts = [
  {
    title: "Distant Galaxy",
    image: "/assets/nft1.png",
    creator: "Animakid",
  },
  {
    title: "Life On Edena",
    image: "/assets/nft2.png",
    creator: "Animakid",
  },
  {
    title: "Astrofiction",
    image: "/assets/nft3.png",
    creator: "Animakid",
  },
]

export default function Artist() {
  const [activeTab, setActiveTab] = useState("created")

  return (
    <div className="bg-[#2B2B2B] text-white min-h-screen">
      {/* Cover */}
      <div
        className="h-80 bg-cover bg-center"
        style={{ backgroundImage: `url(${ImgHeader})` }}
      />

      {/* Artist Info */}
      <div className="max-w-6xl mx-auto px-6 -mt-16">
        <img
          src={Imgavt}
          className="w-28 h-28 rounded-2xl border-4 border-[#2B2B2B]"
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">Animakid</h1>

            <div className="flex gap-10 mb-6">
              <div>
                <p className="text-xl font-semibold">250k+</p>
                <p className="text-gray-400">Volume</p>
              </div>
              <div>
                <p className="text-xl font-semibold">50+</p>
                <p className="text-gray-400">NFTs Sold</p>
              </div>
              <div>
                <p className="text-xl font-semibold">3000+</p>
                <p className="text-gray-400">Followers</p>
              </div>
            </div>

            <p className="text-gray-300 max-w-xl">
              The Internet's Friendliest Designer Kid.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="bg-[#A259FF] px-6 py-3 rounded-xl font-medium">
              0xc0E3...B79C
            </button>
            <button className="border border-[#A259FF] px-6 py-3 rounded-xl">
              + Follow
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-6 text-center font-medium transition relative
                  ${
                    activeTab === tab.key
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
              >
                <span>{tab.label}</span>
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

      {/* NFT Grid */}
      <div className="bg-[#3B3B3B] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nfts.map((nft) => (
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
        </div>
      </div>
    </div>
  )
}
