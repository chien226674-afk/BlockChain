import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { getNFTContract, getMarketContract, MARKET_ADDRESS, NFT_ADDRESS } from '../services/contract';
import api from '../services/api';
import { ethers } from 'ethers';
import NFT_ABI from '../../../smart_contracts/artifacts/contracts/NFT.sol/NFT.json';
import MARKET_ABI from '../../../smart_contracts/artifacts/contracts/Marketplace.sol/Marketplace.json';

const CreateNFT = () => {
    const { account, signer } = useWallet();
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const checkNetwork = async () => {
        if (window.ethereum) {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            // 31337 in hex is 0x7a69
            if (chainId !== '0x7a69' && chainId !== 31337) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x7a69' }],
                    });
                    return true;
                } catch (switchError: any) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: '0x7a69',
                                        chainName: 'Localhost 8545',
                                        rpcUrls: ['http://127.0.0.1:8545'],
                                        nativeCurrency: {
                                            name: 'GO',
                                            symbol: 'GO',
                                            decimals: 18,
                                        },
                                    },
                                ],
                            });
                            return true;
                        } catch (addError) {
                            alert("Failed to add network automatically. Please add Localhost 8545 manually.");
                            return false;
                        }
                    } else {
                        alert("Please switch MetaMask to 'Localhost 8545' (Chain ID 31337).");
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!account || !signer) {
            alert("Please connect your wallet first");
            return;
        }

        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) return;

        if (!file || !name || !description || !price) {
            alert("Please fill all fields (Image, Name, Description, and Price)");
            return;
        }

        if (Number(price) <= 0) {
            alert("Price must be greater than 0 GO");
            return;
        }

        setLoading(true);
        setStatus("Uploading image to IPFS...");

        try {
            // 1. Upload Image to Backend -> Pinata
            const formData = new FormData();
            formData.append('image', file);

            const { data: imageData } = await api.post('/nfts/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const imageUrl = imageData.imageUrl;
            console.log("Image uploaded to IPFS:", imageUrl);

            setStatus("Creating Metadata...");
            // 2. Create Metadata
            const metadata = { name, description, image: imageUrl };
            const { data: metadataData } = await api.post('/nfts/create-metadata', metadata);
            const tokenURI = metadataData.tokenURI;
            console.log("Metadata uploaded to IPFS:", tokenURI);

            setStatus("Minting NFT on Blockchain...");
            // 3. Mint NFT
            const nftContract = await getNFTContract(signer);
            const mintTx = await nftContract.mintNFT(account, tokenURI, { gasLimit: 300000 });
            const mintReceipt = await mintTx.wait();
            console.log("Mint transaction receipt:", mintReceipt);

            const nftInterface = new ethers.Interface(NFT_ABI.abi);
            let tokenId = null;
            console.log("Parsing logs for Transfer event... Logs count:", mintReceipt.logs.length);

            // Log all logs for debugging
            mintReceipt.logs.forEach((log: any, i: number) => {
                console.log(`Log ${i} topics:`, log.topics);
            });

            for (const log of mintReceipt.logs) {
                try {
                    const parsedLog = nftInterface.parseLog(log as any);
                    if (parsedLog && (parsedLog.name === 'Transfer' || parsedLog.name === 'NFTMinted')) {
                        tokenId = parsedLog.args.tokenId.toString();
                        console.log(`Found ${parsedLog.name} event via Interface! tokenId:`, tokenId);
                        break;
                    }
                } catch (e) { }
            }

            // Fallback 1: Manual topic extraction for Transfer or NFTMinted
            if (!tokenId && mintReceipt.logs.length > 0) {
                console.log("Standard parsing failed, trying manual topic extraction...");
                const TRANSFER_TOPIC = ethers.id("Transfer(address,address,uint256)");
                const MINTED_TOPIC = ethers.id("NFTMinted(uint256,address)");

                for (const log of mintReceipt.logs) {
                    if (log.topics[0] === TRANSFER_TOPIC) {
                        if (log.topics.length === 4) {
                            tokenId = ethers.toBigInt(log.topics[3]).toString();
                            console.log("Extracted tokenId from Transfer topic 3:", tokenId);
                            break;
                        } else if (log.data && log.data !== '0x') {
                            const decoded = ethers.AbiCoder.defaultAbiCoder().decode(['uint256'], log.data);
                            tokenId = decoded[0].toString();
                            console.log("Extracted tokenId from Transfer data:", tokenId);
                            break;
                        }
                    } else if (log.topics[0] === MINTED_TOPIC) {
                        if (log.topics.length >= 2) {
                            tokenId = ethers.toBigInt(log.topics[1]).toString();
                            console.log("Extracted tokenId from NFTMinted topic 1:", tokenId);
                            break;
                        }
                    }
                }
            }

            // Fallback 2: Aggressive - Any log from the contract with 4 topics (Transfer)
            if (!tokenId && mintReceipt.logs.length > 0) {
                console.log("Trying aggressive fallback (4 topics)...");
                for (const log of mintReceipt.logs) {
                    if (log.address.toLowerCase() === (await nftContract.getAddress()).toLowerCase() && log.topics.length === 4) {
                        tokenId = ethers.toBigInt(log.topics[3]).toString();
                        console.log("Aggressively extracted tokenId from topic 3:", tokenId);
                        break;
                    }
                }
            }

            // Fallback 3: Desperation - Any non-zero value in any topic or data that isn't the address
            if (!tokenId && mintReceipt.logs.length > 0) {
                console.log("Desperation fallback: Searching for any non-zero tokenId...");
                for (const log of mintReceipt.logs) {
                    // Skip topic 0 (event sig)
                    for (let j = 1; j < log.topics.length; j++) {
                        const val = ethers.toBigInt(log.topics[j]);
                        if (val > 0 && val < 1000000) { // Reasonable tokenId range
                            tokenId = val.toString();
                            console.log(`Potential tokenId found in topic ${j}:`, tokenId);
                            break;
                        }
                    }
                    if (tokenId) break;
                }
            }

            // Fallback 4: Desperation - Contract tokenCount()
            if (!tokenId) {
                console.log("All log-based extractions failed. Trying tokenCount fallback...");
                setStatus("Desperation fallback: Fetching tokenCount from contract...");
                try {
                    const addr = await nftContract.getAddress();
                    console.log("Calling tokenCount on contract at:", addr);
                    const count = await nftContract.tokenCount();
                    tokenId = count.toString();
                    console.log("Recovered tokenId via tokenCount():", tokenId);
                } catch (e: any) {
                    console.error("tokenCount fallback failed:", e);
                    setStatus("tokenCount fallback failed: " + e.message);
                }
            }

            if (!tokenId) {
                const logsStr = JSON.stringify(mintReceipt.logs, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2);
                console.error("CRITICAL: Failed to recover tokenId. Logs:", logsStr);
                throw new Error(`Could not find or recover TokenID. 
                Contract Address: ${await nftContract.getAddress()}
                Logs Found: ${mintReceipt.logs.length}
                Please check if you are on the correct network (Cronos vs Hardhat).`);
            }

            setStatus("Approving Marketplace...");
            // 4. Approve Marketplace
            const approveTx = await nftContract.setApprovalForAll(MARKET_ADDRESS, true, { gasLimit: 300000 });
            await approveTx.wait();

            setStatus("Listing on Marketplace...");
            // 5. List on Marketplace
            const marketContract = await getMarketContract(signer);
            const listPrice = ethers.parseEther(price);
            const listTx = await marketContract.makeItem(await nftContract.getAddress(), tokenId, listPrice, { gasLimit: 300000 });
            const listReceipt = await listTx.wait();
            console.log("Listing transaction receipt:", listReceipt);

            // Extract itemId from Offered event
            const marketInterface = new ethers.Interface(MARKET_ABI.abi);
            let itemId = null;
            for (const log of listReceipt.logs) {
                try {
                    const parsedLog = marketInterface.parseLog(log as any);
                    if (parsedLog && parsedLog.name === 'Offered') {
                        itemId = parsedLog.args.itemId.toString();
                        console.log("Found Offered event, itemId:", itemId);
                        break;
                    }
                } catch (e) { }
            }

            setStatus("Syncing with backend...");
            console.log("DEBUG: NFT_ADDRESS from contract.ts is:", NFT_ADDRESS);
            // 6. Sync with backend
            const nftData = {
                tokenId,
                contractAddress: NFT_ADDRESS || "MISSING_ADDRESS",
                name,
                description,
                image: imageUrl,
                tokenURI,
                creatorId: account, // Backend will now resolve this correctly
                ownerId: account,
                price: price,
                itemId: itemId
            };
            console.log("Sending sync request to backend:", nftData);

            await api.post('/nfts/create', nftData);

            alert("NFT Created & Listed Successfully!");
            navigate('/user/profile');

        } catch (error: any) {
            console.error("Creation flow failed", error);
            setStatus("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 text-white flex justify-center">
            <div className="w-full max-w-2xl bg-[#2B2B2B] p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-8 text-center">Create New NFT</h1>

                <form onSubmit={handleCreate} className="space-y-6">
                    {/* File Upload */}
                    <div className="border border-dashed border-gray-600 rounded-lg p-10 text-center hover:bg-gray-800 transition cursor-pointer relative">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                        />
                        {file ? (
                            <div>
                                <p className="text-green-400 font-bold">{file.name}</p>
                                <img src={URL.createObjectURL(file)} alt="Preview" className="mt-4 max-h-48 mx-auto rounded" />
                            </div>
                        ) : (
                            <p className="text-gray-400">Drag & Drop or Click to Upload Image</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#3B3B3B] border border-gray-600 rounded-lg p-3 focus:border-purple-500 outline-none" placeholder="Item Name" />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#3B3B3B] border border-gray-600 rounded-lg p-3 focus:border-purple-500 outline-none h-32" placeholder="Description..." />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Price (GO)</label>
                        <input
                            type="number"
                            step="0.001"
                            min="0"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="w-full bg-[#3B3B3B] border border-gray-600 rounded-lg p-3 focus:border-purple-500 outline-none"
                            placeholder="0.00"
                        />
                    </div>

                    {status && <p className="text-center text-yellow-400 animate-pulse">{status}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-lg font-bold text-lg transition disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Create & Mint NFT'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateNFT;
