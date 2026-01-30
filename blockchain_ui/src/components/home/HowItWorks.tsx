export default function HowItWorks() {
  const steps = [
    {
      title: "Setup Your Wallet",
      desc: "Set up your wallet of choice. Connect it to the marketplace by clicking the wallet icon in the top right corner.",
      icon: "/assets/icons/wallet.png",
    },
    {
      title: "Create Collection",
      desc: "Upload your work and setup your collection. Add a description, social links and floor price.",
      icon: "/assets/icons/collection.png",
    },
    {
      title: "Start Earning",
      desc: "Choose between auctions and fixed-price listings. Start earning by selling your NFTs.",
      icon: "/assets/icons/earning.png",
    },
  ];

  return (
    <section className="bg-[#2B2B2B] py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-white">How It Works</h2>
          <p className="text-gray-400 mt-2">
            Find Out How To Get Started
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-[#3B3B3B] rounded-2xl p-8 text-center hover:scale-105 transition"
            >
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>

              <h3 className="text-white text-xl font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
