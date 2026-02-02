import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import creator_1 from "@/assets/img_ui/creator_1.png"
import creator_2 from "@/assets/img_ui/creator_2.png"
import creator_3 from "@/assets/img_ui/creator_3.png"
import creator_4 from "@/assets/img_ui/creator_4.png"
import creator_5 from "@/assets/img_ui/creator_5.png"
import creator_6 from "@/assets/img_ui/creator_6.png"
import creator_7 from "@/assets/img_ui/creator_7.png"
import creator_8 from "@/assets/img_ui/creator_8.png"
import creator_9 from "@/assets/img_ui/creator_9.png"
import creator_10 from "@/assets/img_ui/creator_10.png"
import creator_11 from "@/assets/img_ui/creator_11.png"
import creator_12 from "@/assets/img_ui/creator_12.png"

const creators = [
  { name: "Keepitreal", rank: 1, avt: creator_1 },
  { name: "Digilab", rank: 2, avt: creator_2 },
  { name: "Gravityone", rank: 3, avt: creator_3 },
  { name: "Juanie", rank: 4, avt: creator_4 },
  { name: "Bluewhale", rank: 5, avt: creator_5 },
  { name: "Mr Fox", rank: 6, avt: creator_6 },
  { name: "Shroomie", rank: 7, avt: creator_7 },
  { name: "Robotica", rank: 8, avt: creator_8 },
  { name: "Rustyrobot", rank: 9, avt: creator_9 },
  { name: "Animakid", rank: 10, avt: creator_10 },
  { name: "Dotgu", rank: 11, avt: creator_11 },
  { name: "Ghiblier", rank: 12, avt: creator_12 },
];

export default function TopCreators() {
  return (
    <section className="bg-[#2B2B2B] text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Top Creators
            </h2>
            <p className="text-gray-400">
              Checkout Top Rated Creators On The NFT Marketplace
            </p>
          </div>

          <button className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition cursor-pointer">
            <FontAwesomeIcon icon={faRocket} className="text-sm" />
            View Rankings
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {creators.map((creator) => (
            <div
              key={creator.rank}
              className="relative bg-[#3B3B3B] rounded-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition cursor-pointer"
            >
              {/* Rank */}
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#2B2B2B] flex items-center justify-center text-sm text-gray-400">
                {creator.rank}
              </div>

              {/* Avatar */}
              <img
                src={creator.avt}
                alt={creator.name}
                className="w-20 h-20 rounded-full object-cover mb-4"
              />

              {/* Name */}
              <h3 className="font-semibold mb-1">
                {creator.name}
              </h3>

              {/* Sales */}
              <p className="text-sm text-gray-400">
                Total Sales:{" "}
                <span className="text-white font-medium">
                  34.53 GO
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* Mobile button */}
        <div className="mt-10 flex justify-center md:hidden">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-purple-500 text-purple-400">
            🚀 View Rankings
          </button>
        </div>
      </div>
    </section>
  );
}
