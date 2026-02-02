import { faEye } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import mushrooms from "@/assets/img_ui/2_1.png"
import avatar from "@/assets/img_ui/mushroom_avt.png"

export default function FeaturedNFT() {
  return (
    <section
      className="relative h-160 flex items-end"
      style={{
        backgroundImage: "url(" + mushrooms + ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-purple-600/90 via-purple-600/60 to-transparent" />

      {/* Content */}
      <div className="relative w-full max-w-6xl mx-auto px-6 pb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 text-white">

        {/* Left */}
        <div>
          {/* Creator */}
          <div className="inline-flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full mb-6">
            <img
              src={avatar}
              alt="Shroomie"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm">Shroomie</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Magic Mushrooms
          </h2>

          <button className="inline-flex cursor-pointer items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-95 transition">
            <FontAwesomeIcon icon={faEye} className="text-sm" />
            See NFT
          </button>
        </div>

        {/* Right - Countdown */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 w-64">
          <p className="text-sm text-gray-300 mb-3">
            Auction ends in:
          </p>

          <div className="flex justify-between text-center">
            <div>
              <p className="text-3xl font-bold">59</p>
              <p className="text-xs text-gray-300">Hours</p>
            </div>
            <div>
              <p className="text-3xl font-bold">59</p>
              <p className="text-xs text-gray-300">Minutes</p>
            </div>
            <div>
              <p className="text-3xl font-bold">59</p>
              <p className="text-xs text-gray-300">Seconds</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
