import icon_1 from "@/assets/img_ui/icon-3@2x.svg"
import icon_2 from "@/assets/img_ui/icon-4@2x.svg"
import icon_3 from "@/assets/img_ui/icon-5@2x.svg"

export default function HowItWorks() {
  const steps = [
    {
      title: "Setup Your Wallet",
      desc: "Set up your wallet of choice. Connect it to the marketplace by clicking the wallet icon in the top right corner.",
      icon: icon_1,
    },
    {
      title: "Create Collection",
      desc: "Upload your work and setup your collection. Add a description, social links and floor price.",
      icon: icon_2,
    },
    {
      title: "Start Earning",
      desc: "Choose between auctions and fixed-price listings. Start earning by selling your NFTs.",
      icon: icon_3,
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
              <div className="flex justify-center mb-6 ">
                <div className="w-32 h-32 ">
                  <div className="w-full h-full rounded-full overflow-hidden  ">
                    <img
                      src={step.icon}
                      alt={step.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
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
      </div >
    </section >
  );
}
