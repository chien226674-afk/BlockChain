import heroImg from "@/assets/heroanimationtransparentbck-2.gif"
export default function HeroSection() {
    return (
        <section className="bg-[#2B2B2B] text-white">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT CONTENT */}
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            Discover <br />
                            Digital Art & <br />
                            Collect NFTs
                        </h1>

                        <p className="text-gray-300 mt-6 text-lg leading-relaxed max-w-xl">
                            NFT Marketplace UI Created With Anima For Figma.
                            Collect, Buy And Sell Art From More Than 20k NFT Artists.
                        </p>

                        <button className="mt-8 inline-flex items-center gap-2 bg-[#A259FF] hover:bg-[#8e45ff] px-8 py-4 rounded-full font-semibold transition cursor-pointer hover:scale-95 transform duration-300">
                            <i className="fa-solid fa-rocket"></i>
                            Get Started
                        </button>

                        {/* STATS */}
                        <div className="flex gap-12 mt-10">
                            <div>
                                <p className="text-2xl font-bold">240k+</p>
                                <p className="text-gray-300">Total Sale</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">100k+</p>
                                <p className="text-gray-300">Auctions</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">240k+</p>
                                <p className="text-gray-300">Artists</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CARD */}
                        <div className="flex justify-center min-w-125 min-h-125">
                         <img
                            src={heroImg}
                            alt="NFT Art"
                            className="
                                w-full
                                max-w-2xl
                                h-auto
                                object-contain
                            "
                            />

                        </div>
                    </div>
                </div>
        </section>
    );
}
