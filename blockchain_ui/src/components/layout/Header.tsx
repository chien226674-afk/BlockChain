import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../ui/button";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-[#2B2B2B]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center text-white cursor-pointer">
          <img src="/logo.png" className="w-10 h-10 object-contain" />
          <h1 className="font-mono font-medium ml-2 text-xl">
            NFT Marketplace
          </h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-4 text-white">
          <Button variant="ghost">Marketplace</Button>
          <Button variant="ghost">Ranking</Button>
          <Button variant="ghost">Connect a Wallet</Button>

          <Button
            variant="primary"
            className="w-38.75 h-12 rounded-3xl text-[1rem] font-medium hover:scale-95 transition"
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Sign Up
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          <FontAwesomeIcon icon={open ? faXmark : faBars} />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#3B3B3B] px-6 py-6 space-y-4 text-white">
          <Button variant="ghost" className="w-full justify-start">
            Marketplace
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Ranking
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Connect a Wallet
          </Button>
          <Button
            variant="primary"
            className="w-full rounded-2xl text-[1rem] font-medium"
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Sign Up
          </Button>
        </div>
      )}
    </header>
  );
}

export default Header;
