const collections = [
  {
    title: "Dsgn Animals",
    author: "MrFox",
    mainImg: "/assets/dog.png",
    thumbs: ["/assets/dog1.png", "/assets/dog2.png"],
  },
  {
    title: "Magic Mushrooms",
    author: "Shroomie",
    mainImg: "/assets/mushroom.png",
    thumbs: ["/assets/mush1.png", "/assets/mush2.png"],
  },
  {
    title: "Disco Machines",
    author: "BeKind2Robots",
    mainImg: "/assets/robot.png",
    thumbs: ["/assets/robot1.png", "/assets/robot2.png"],
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
                  src="/assets/avatar.png"
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
