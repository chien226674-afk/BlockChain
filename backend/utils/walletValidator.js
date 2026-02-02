import { ethers } from 'ethers';
import { WalletError } from './errors.js';

/**
 * Wallet Signature Verification Utilities
 */

/**
 * Verify Ethereum signature
 * @param {string} message - Original message that was signed
 * @param {string} signature - Signature from wallet
 * @param {string} expectedAddress - Expected signer address
 * @returns {boolean} - True if signature is valid
 */
export const verifySignature = (message, signature, expectedAddress) => {
    try {
        console.log("Attempting to verify signature for address:", expectedAddress);
        
        // Ethers v5 vs v6 compatibility check
        let recoveredAddress;
        if (ethers.utils && ethers.utils.verifyMessage) {
            // Ethers v5
            recoveredAddress = ethers.utils.verifyMessage(message, signature);
        } else if (ethers.verifyMessage) {
            // Ethers v6
            recoveredAddress = ethers.verifyMessage(message, signature);
        } else {
            console.error("Ethers verifyMessage function not found in either ethers or ethers.utils");
            console.log("Available ethers keys:", Object.keys(ethers));
            throw new Error("Ethers configuration error");
        }
        
        // Compare addresses (case-insensitive)
        const isValid = recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
        console.log("Signature verification result:", isValid, "Recovered:", recoveredAddress);
        return isValid;
    } catch (error) {
        console.error('Signature verification error detailed:', error);
        throw new WalletError('Invalid signature format or verification failed');
    }
};

/**
 * Validate Ethereum address format
 * @param {string} address - Ethereum address to validate
 * @returns {boolean} - True if valid
 */
export const isValidEthereumAddress = (address) => {
    try {
        if (ethers.utils && ethers.utils.isAddress) {
            return ethers.utils.isAddress(address);
        }
        return ethers.isAddress(address);
    } catch (error) {
        return false;
    }
};

/**
 * Normalize Ethereum address to checksum format
 * @param {string} address - Ethereum address
 * @returns {string} - Checksummed address
 */
export const normalizeAddress = (address) => {
    try {
        if (ethers.utils && ethers.utils.getAddress) {
            return ethers.utils.getAddress(address);
        }
        return ethers.getAddress(address);
    } catch (error) {
        throw new WalletError('Invalid Ethereum address format');
    }
};

/**
 * Generate nonce message for wallet signing
 * @param {string} nonce - Random nonce
 * @returns {string} - Message to sign
 */
export const generateNonceMessage = (nonce) => {
    return `Please sign this message to verify your identity. Nonce: ${nonce}`;
};

/**
 * Validate signature middleware
 */
export const validateSignature = async (req, res, next) => {
    try {
        const { walletAddress, signature } = req.body;
        
        if (!walletAddress || !signature) {
            throw new WalletError('Wallet address and signature are required');
        }

        // Validate address format
        if (!isValidEthereumAddress(walletAddress)) {
            throw new WalletError('Invalid Ethereum address format');
        }

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Check if wallet owns NFT (for smart contract integration)
 * @param {string} contractAddress - NFT contract address
 * @param {string} tokenId - Token ID
 * @param {string} walletAddress - Wallet to check
 * @param {object} provider - Ethers provider
 * @returns {Promise<boolean>} - True if wallet owns the NFT
 */
export const checkNFTOwnership = async (contractAddress, tokenId, walletAddress, provider) => {
    try {
        const abi = ['function ownerOf(uint256 tokenId) view returns (address)'];
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const owner = await contract.ownerOf(tokenId);
        return owner.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
        console.error('NFT ownership check failed:', error);
        throw new WalletError('Failed to verify NFT ownership');
    }
};
