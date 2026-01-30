import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faTwitter, faDiscord, faInstagram } from "@fortawesome/free-brands-svg-icons"


function Footer() {
   return (
    <footer className="bg-[#3B3B3B] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" className="w-10 h-10" />
              <h1 className="font-mono text-xl font-bold">
                NFT Marketplace
              </h1>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              NFT marketplace UI created with Anima for Figma.
            </p>

            <p className="text-gray-400 text-sm">Join our community</p>

            <div className="flex gap-4 text-gray-300 text-xl">
              <FontAwesomeIcon icon={faDiscord} className="text-[1.2rem] cursor-pointer hover:text-white" />
              <FontAwesomeIcon icon={faYoutube} className="text-[1.2rem] cursor-pointer hover:text-white" />
              <FontAwesomeIcon icon={faTwitter} className="text-[1.2rem] cursor-pointer hover:text-white" />
              <FontAwesomeIcon icon={faInstagram} className="text-[1.2rem] cursor-pointer hover:text-white" />
            </div>
          </div>

          <div>
            <h2 className="font-mono text-xl font-bold mb-4">
              Explore
            </h2>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="cursor-pointer hover:text-white">Marketplace</li>
              <li className="cursor-pointer hover:text-white">Rankings</li>
              <li className="cursor-pointer hover:text-white">Connect a wallet</li>
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-xl font-bold mb-4">
              Join Our Weekly Digest
            </h2>

            <p className="text-gray-300 text-sm mb-6">
              Get exclusive promotions & updates straight to your inbox.
            </p>

            <div className="flex bg-white rounded-full overflow-hidden max-w-md">
              <Input
                placeholder="Enter your email here"
                className="border-none rounded-none text-black"
              />
              <Button className="rounded-none rounded-r-full bg-[#A259FF] hover:bg-[#8a4de8] px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-12 pt-6 text-sm text-gray-400">
          © NFT Market. Use this template freely.
        </div>
      </div>
    </footer>
  )
}

export default Footer