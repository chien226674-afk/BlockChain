import { Link } from 'react-router-dom';
import heroImg from "@/assets/hero-animation.gif"

export default function HeroSection() {
    return (
        <section className="bg-[#2B2B2B] text-white">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT CONTENT */}
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            Discover & Collect <br />
                            <span className="text-[#A259FF]">Extraordinary</span> NFTs
                        </h1>

                        <p className="text-gray-300 mt-6 text-lg leading-relaxed max-w-xl">
                            The leading NFT Marketplace on Ethereum. Home to the next generation of digital creators.
                        </p>

                        <div className="flex gap-4 mt-8">
                            <Link
                                to="/marketplace"
                                className="inline-flex items-center gap-2 bg-[#A259FF] hover:bg-[#8e45ff] px-8 py-4 rounded-xl font-semibold transition cursor-pointer hover:scale-95 transform duration-300"
                            >
                                <i className="fa-solid fa-rocket"></i>
                                Explore Now
                            </Link>
                            <Link
                                to="/connect-wallet"
                                className="inline-flex items-center gap-2 bg-transparent border border-[#A259FF] px-8 py-4 rounded-xl font-semibold hover:bg-[#A259FF]/10 transition cursor-pointer hover:scale-95 transform duration-300"
                            >
                                Connect Wallet
                            </Link>
                        </div>

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
