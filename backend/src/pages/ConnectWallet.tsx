import Metamark from "@/assets/Metamark.png";
import { connectMetaMask } from '@/lib/metamask'
import { useState } from 'react'

export default function ConnectWallet() {

  const [address, setAddress] = useState<string | null>(null)

  const handleConnect = async () => {
    const wallet = await connectMetaMask()
    if (wallet) {
      setAddress(wallet)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#2b2b2b] text-white">

      <div className="hidden lg:flex flex-1">
        <img
          src="Sign_Up.png"
          alt="Connect Wallet"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-1  justify-start items-start px-6 mt-30">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-4">Connect Wallet</h1>

          <p className="text-gray-300 mb-8 leading-relaxed">
            Choose a wallet you want to connect.
            <br />
            There are several wallet providers.
          </p>

          <button
      onClick={handleConnect}
      className="
        w-full flex items-center gap-4
        border border-purple-500
        rounded-xl px-6 py-4
        hover:bg-purple-500/10
        transition
        cursor-pointer
      "
    >
      <img src={Metamark} alt="Meta Mask" className="w-8 h-8" />

      <span className="text-lg font-semibold">
        {address
          ? `${address.slice(0, 6)}...${address.slice(-4)}`
          : 'MetaMask'}
      </span>
    </button>
        </div>
      </div>
    </div>
  );
}
