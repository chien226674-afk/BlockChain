import axios from 'axios';
import FormData from 'form-data';
import { IPFSError } from './errors.js';

/**
 * IPFS Upload Handler with Error Handling
 */

const PINATA_API_URL = 'https://api.pinata.cloud';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Sleep utility for retries
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Upload file to IPFS via Pinata with retry logic
 * @param {Buffer|Stream} file - File to upload
 * @param {string} fileName - Name of the file
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<string>} - IPFS hash
 */
export const uploadToIPFS = async (file, fileName, retryCount = 0) => {
    try {
        // Validate environment variables
        if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
            throw new IPFSError('IPFS credentials not configured. Please set PINATA_API_KEY and PINATA_SECRET_KEY');
        }

        const formData = new FormData();
        formData.append('file', file, fileName);

        const metadata = JSON.stringify({
            name: fileName,
            keyvalues: {
                uploadedAt: new Date().toISOString()
            }
        });
        formData.append('pinataMetadata', metadata);

        const response = await axios.post(
            `${PINATA_API_URL}/pinning/pinFileToIPFS`,
            formData,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    'pinata_api_key': process.env.PINATA_API_KEY,
                    'pinata_secret_api_key': process.env.PINATA_SECRET_KEY
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 60000 // 60 seconds
            }
        );

        if (!response.data || !response.data.IpfsHash) {
            throw new IPFSError('Invalid response from IPFS service');
        }

        return response.data.IpfsHash;

    } catch (error) {
        console.error(`IPFS upload attempt ${retryCount + 1} failed:`, error.message);

        // Retry logic
        if (retryCount < MAX_RETRIES) {
            console.log(`Retrying in ${RETRY_DELAY}ms...`);
            await sleep(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
            return uploadToIPFS(file, fileName, retryCount + 1);
        }

        // Handle specific errors
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.error || error.response.data?.message;

            if (status === 401) {
                throw new IPFSError('IPFS authentication failed. Check your Pinata API credentials');
            } else if (status === 413) {
                throw new IPFSError('File too large for IPFS upload. Maximum size is 100MB');
            } else if (status === 429) {
                throw new IPFSError('IPFS rate limit exceeded. Please try again later');
            } else {
                throw new IPFSError(`IPFS upload failed: ${message || 'Unknown error'}`);
            }
        } else if (error.code === 'ECONNABORTED') {
            throw new IPFSError('IPFS upload timeout. File may be too large or network is slow');
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            throw new IPFSError('Cannot connect to IPFS service. Please check your internet connection');
        } else {
            throw new IPFSError(`IPFS upload failed: ${error.message}`);
        }
    }
};

/**
 * Upload JSON metadata to IPFS
 * @param {object} metadata - Metadata object
 * @returns {Promise<string>} - IPFS hash
 */
export const uploadMetadataToIPFS = async (metadata) => {
    try {
        if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
            throw new IPFSError('IPFS credentials not configured');
        }

        const response = await axios.post(
            `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
            metadata,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': process.env.PINATA_API_KEY,
                    'pinata_secret_api_key': process.env.PINATA_SECRET_KEY
                },
                timeout: 30000
            }
        );

        if (!response.data || !response.data.IpfsHash) {
            throw new IPFSError('Invalid response from IPFS service');
        }

        return response.data.IpfsHash;

    } catch (error) {
        console.error('IPFS metadata upload failed:', error.message);

        if (error instanceof IPFSError) {
            throw error;
        }

        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                throw new IPFSError('IPFS authentication failed');
            } else if (status === 429) {
                throw new IPFSError('IPFS rate limit exceeded');
            }
        }

        throw new IPFSError(`Metadata upload failed: ${error.message}`);
    }
};

/**
 * Get IPFS gateway URL
 * @param {string} ipfsHash - IPFS hash
 * @returns {string} - Gateway URL
 */
export const getIPFSUrl = (ipfsHash) => {
    if (!ipfsHash) {
        throw new IPFSError('IPFS hash is required');
    }
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
};

/**
 * Validate file before IPFS upload
 * @param {object} file - File object from multer
 * @param {number} maxSize - Maximum file size in bytes (default 100MB)
 * @returns {boolean} - True if valid
 */
export const validateFileForIPFS = (file, maxSize = 100 * 1024 * 1024) => {
    if (!file) {
        throw new IPFSError('No file provided');
    }

    if (file.size > maxSize) {
        throw new IPFSError(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
    }

    // Validate image types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
        throw new IPFSError('Invalid file type. Only images are allowed (JPEG, PNG, GIF, WebP, SVG)');
    }

    return true;
};
