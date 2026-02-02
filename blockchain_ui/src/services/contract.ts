import { ethers } from 'ethers';
import NFT_ABI from '../../../smart_contracts/artifacts/contracts/NFT.sol/NFT.json';
import MARKET_ABI from '../../../smart_contracts/artifacts/contracts/Marketplace.sol/Marketplace.json';
// import ERC20_ABI from './ERC20_ABI.json';

// Addresses (Update these after deployment!)
export const NFT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const MARKET_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// export const CBS_ADDRESS = ""; // CBS Removed for Native Token Payment

export const getProvider = () => {
    if (window.ethereum) {
        return new ethers.BrowserProvider(window.ethereum);
    }
    return null;
};

export const getSigner = async (provider: ethers.BrowserProvider) => {
    return await provider.getSigner();
};

export const getNFTContract = async (signerOrProvider: ethers.Signer | ethers.Provider) => {
    return new ethers.Contract(NFT_ADDRESS, NFT_ABI.abi, signerOrProvider);
};

export const getMarketContract = async (signerOrProvider: ethers.Signer | ethers.Provider) => {
    return new ethers.Contract(MARKET_ADDRESS, MARKET_ABI.abi, signerOrProvider);
};

// export const getCBSContract = async (signerOrProvider: ethers.Signer | ethers.Provider) => {
//     return new ethers.Contract(CBS_ADDRESS, ERC20_ABI, signerOrProvider);
// };
