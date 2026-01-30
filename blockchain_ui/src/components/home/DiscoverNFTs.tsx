import {faEye} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const nfts = [
  {
    title: "Distant Galaxy",
    creator: "MoonDancer",
    image: "/assets/nft-1.png",
  },
  {
    title: "Life On Edena",
    creator: "NebulaKid",
    image: "/assets/nft-2.png",
  },
  {
    title: "Astrofiction",
    creator: "Spaceone",
    image: "/assets/nft-3.png",
  },
];

export default function DiscoverNFTs() {
  return (
    <section className="bg-[#2B2B2B] text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Discover More NFTs
            </h2>
            <p className="text-gray-400">
              Explore New Trending NFTs
            </p>
          </div>

          <button className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition cursor-pointer">
            <FontAwesomeIcon icon={faEye} className="text-sm" />
            See All
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {nfts.map((nft) => (
            <div
              key={nft.title}
              className="bg-[#3B3B3B] rounded-2xl overflow-hidden hover:scale-105 transition cursor-pointer"
            >
              {/* Image */}
              <img
                src={nft.image}
                alt={nft.title}
                className="w-full h-72 object-cover"
              />

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2">
                  {nft.title}
                </h3>

                {/* Creator */}
                <div className="flex items-center gap-2 mb-4">
                  <img
                    src="/assets/avatar.png"
                    alt={nft.creator}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-300">
                    {nft.creator}
                  </span>
                </div>

                {/* Price */}
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

        {/* Mobile button */}
        <div className="mt-10 flex justify-center md:hidden cursor-pointer">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-purple-500 text-purple-400">
            👁 See All
          </button>
        </div>
      </div>
    </section>
  );
}
