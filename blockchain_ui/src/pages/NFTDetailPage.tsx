const nfts = [
  {
    title: "Foxy Life",
    image: "/assets/nft1.png",
    creator: "Orbitian",
  },
  {
    title: "Cat From Future",
    image: "/assets/nft2.png",
    creator: "Orbitian",
  },
  {
    title: "Psycho Dog",
    image: "/assets/nft3.png",
    creator: "Orbitian",
  },
];

export default function NFTDetailPage() {
  return (
    <div className="bg-[#2B2B2B] text-white">

      {/* HERO IMAGE */}
      <div className="w-full h-130 overflow-hidden">
        <img
          src="/assets/nft-hero.png"
          alt="NFT Hero"
          className="w-full h-full object-cover"
        />
      </div>

      {/* INFO + AUCTION */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT INFO */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-2">The Orbitans</h1>
            <p className="text-gray-400 mb-6">
              Minted On Sep 30, 2022
            </p>

            <p className="text-gray-400 mb-2">Created By</p>
            <div className="flex items-center gap-2">
              <img
                src="/assets/avatar.png"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">Orbitian</span>
            </div>
          </div>

          {/* AUCTION CARD */}
          <div className="bg-[#3B3B3B] rounded-2xl p-6">
            <p className="text-gray-400 mb-3">Auction ends in:</p>

            <div className="flex justify-between text-center mb-6">
              <div>
                <p className="text-3xl font-bold">21</p>
                <p className="text-xs text-gray-400">Hours</p>
              </div>
              <div>
                <p className="text-3xl font-bold">16</p>
                <p className="text-xs text-gray-400">Minutes</p>
              </div>
              <div>
                <p className="text-3xl font-bold">28</p>
                <p className="text-xs text-gray-400">Seconds</p>
              </div>
            </div>

            <button className="w-full bg-purple-500 hover:bg-purple-600 transition rounded-xl py-3 font-semibold">
              Place Bid
            </button>
          </div>

        </div>
      </div>

      {/* DESCRIPTION / DETAILS / TAGS */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-6 space-y-10">

          {/* DESCRIPTION */}
          <div className="max-w-155 text-xl">
            <h3 className="text-gray-400 mb-3">Description</h3>
            <p className="text-white leading-relaxed whitespace-pre-line">
              The Orbitans is a collection of 10,000 unique NFTs on the Ethereum
              blockchain.

              {"\n\n"}There are all sorts of beings in the NFT Universe. The most
              advanced and friendly of the bunch are Orbitans.

              {"\n\n"}They live in metal space machines, high up in the sky and
              only have one foot on Earth.

              {"\n\n"}These Orbitans are a peaceful race, but they have been at
              war with a group of invaders for many generations. The invaders
              are called Upside-Downs.
            </p>
          </div>

          {/* DETAILS */}
          <div>
            <h3 className="text-gray-400 mb-3">Details</h3>
            <div className="space-y-2 text-gray-200">
              <p>🌐 View on Etherscan</p>
              <p>🌐 View Original</p>
            </div>
          </div>

          {/* TAGS */}
          <div>
            <h3 className="text-gray-400 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {["Animation", "Illustration", "Moon", "Moon"].map((tag) => (
                <span
                  key={tag}
                  className="bg-[#3B3B3B] px-4 py-2 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* MORE FROM THIS ARTIST */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">
            More From This Artist
          </h2>

          <button className=" cursor-pointer border border-purple-500 px-6 py-3 rounded-xl hover:bg-purple-500/20 transition">
            → Go To Artist Page
          </button>
        </div>

        {/* NFT GRID */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nfts.map((nft) => (
              <div
                key={nft.title}
                className="bg-[#3B3B3B] rounded-2xl overflow-hidden hover:scale-105 transition cursor-pointer"
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
  );
}
