import React from 'react'

function Footer() {
  return (
    <div className='flex justify-center mt-10 bg-[#3B3B3B]'>
    <div className='flex justify-between items-center w-262.5'>
        <div className='flex-1'>
            <div className='flex items-center ml-5 text-[#ffffff]  cursor-pointer text-[1.3rem]'>
                <button className="cursor-pointer"><img src="logo.png" className="w-10 h-10 object-contain"></img></button>
               <h1 className="font-mono font-semibold ml-2">NFT Marketplace</h1>
            </div>
            <div>
                NFT marketplace UI created with Anima for Figma.
            </div>
            <div>
                Join our community
            </div>
        </div>
        <div className='flex-1'>b</div>
        <div className='flex-1'>c</div>
    </div>
    </div>

  )
}

export default Footer