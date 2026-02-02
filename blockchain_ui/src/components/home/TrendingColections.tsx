import colecction1_1 from "@/assets/img_ui/1_1.png"
import colecction1_2 from "@/assets/img_ui/1_2.png"
import colecction1_3 from "@/assets/img_ui/1_3.png"
import colecction2_1 from "@/assets/img_ui/2_1.png"
import colecction2_2 from "@/assets/img_ui/2_2.png"
import colecction2_3 from "@/assets/img_ui/2_3.png"
import colecction3_1 from "@/assets/img_ui/3_1.png"
import colecction3_2 from "@/assets/img_ui/3_2.png"
import colecction3_3 from "@/assets/img_ui/3_3.png"
import avt_1 from "@/assets/img_ui/avt_1.png"
import avt_2 from "@/assets/img_ui/avt_2.png"
import avt_3 from "@/assets/img_ui/avt_3.png"

const collections = [
  {
    title: "Dsgn Animals",
    author: "MrFox",
    mainImg: colecction1_1,
    thumbs: [colecction1_2, colecction1_3],
    avt: avt_1,
  },
  {
    title: "Magic Mushrooms",
    author: "Shroomie",
    mainImg: colecction2_1,
    thumbs: [colecction2_2, colecction2_3],
    avt: avt_2,
  },
  {
    title: "Disco Machines",
    author: "BeKind2Robots",
    mainImg: colecction3_1,
    thumbs: [colecction3_2, colecction3_3],
    avt: avt_3,
  },
];

export default function TrendingCollection() {
  return (
    <section className="bg-[#2B2B2B] text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-2">
          Trending Collection
        </h2>
        <p className="text-gray-400 mb-12">
          Checkout Our Weekly Updated Trending Collection.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {collections.map((item, idx) => (
            <div key={idx} className="cursor-pointer">
              {/* Main image */}
              <img
                src={item.mainImg}
                className="w-full aspect-square object-cover rounded-2xl mb-4"
                alt={item.title}
              />

              {/* Thumbnails */}
              <div className="flex gap-3 mb-4">
                {item.thumbs.map((thumb, i) => (
                  <img
                    key={i}
                    src={thumb}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                ))}

                <div className="w-20 h-20 rounded-xl bg-purple-500 flex items-center justify-center font-bold">
                  1025+
                </div>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg mb-2">
                {item.title}
              </h3>

              {/* Author */}
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <img
                  src={item.avt}
                  className="w-6 h-6 rounded-full"
                />
                {item.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
