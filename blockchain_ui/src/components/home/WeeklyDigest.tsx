export default function WeeklyDigest() {
  return (
    <section className="bg-[#2B2B2B] py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-[#3B3B3B] rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* Image */}
          <div>
            <img
              src="/assets/images/astronaut.png"
              alt="Weekly Digest"
              className="w-full rounded-2xl object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Our Weekly Digest
            </h2>
            <p className="text-gray-400 mb-6">
              Get exclusive promotions & updates straight to your inbox.
            </p>

            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email here"
                className="flex-1 rounded-xl px-4 py-3 text-black outline-none bg-amber-50"
              />
              <button
                type="submit"
                className="bg-purple-600 px-6 py-3 rounded-xl text-white font-semibold hover:scale-95 transition"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
