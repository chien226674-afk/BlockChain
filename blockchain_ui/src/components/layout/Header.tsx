import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons"
import { Button } from "../ui/button";


function Header() {
    return (<div className="flex justify-between pt-5 ml-12.5">
            <div className="flex items-center ml-5 text-[#ffffff]  cursor-pointer text-2xl">
                <button className="cursor-pointer"><img src="logo.png" className="w-15 h-15 object-contain"></img></button>
               <h1 className="font-mono font-medium ml-2">NFT Marketplace</h1>
            </div>
            <div className="text-2xl">
                <Button  variant="ghost" >Marketplace</Button>
                <Button  variant="ghost">Ranking</Button>
                <Button  variant="ghost">Connect a Wallet</Button>
                <Button  variant="primary" className="mr-12.5 w-38.75 h-15 rounded-3xl text-[1rem] font-medium hover:scale-95 transition  hover:scale-95 transform transition-all duration-300 ease-in-out"><FontAwesomeIcon icon={faUser} className="text-[1.2rem]"/> Sign Up</Button>
            </div>
    </div>  );
}

export default Header;