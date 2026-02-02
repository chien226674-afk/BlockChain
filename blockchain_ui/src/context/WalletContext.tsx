import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ethers } from 'ethers';

const HOODI_CHAIN_ID = '0x88b70'; // 560048
const HOODI_RPC_URL = 'https://rpc.hoodi.ethpandaops.io';
const HOODI_NETWORK_CONFIG = {
    chainId: HOODI_CHAIN_ID,
    chainName: 'Hoodi Testnet',
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: [HOODI_RPC_URL],
    blockExplorerUrls: [], // Add if available
};

interface WalletContextType {
    account: string | null;
    balance: string | null;
    provider: ethers.BrowserProvider | null;
    signer: ethers.JsonRpcSigner | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    isConnected: boolean;
    chainId: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [chainId, setChainId] = useState<string | null>(null);

    const updateSigner = async (prov: ethers.BrowserProvider, acc: string) => {
        try {
            const s = await prov.getSigner(acc);
            setSigner(s);
        } catch (error) {
            console.error("Failed to update signer", error);
            setSigner(null);
        }
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const _provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(_provider);

                const accounts = await _provider.send("eth_requestAccounts", []);
                const _account = accounts[0];
                setAccount(_account);

                const _balance = await _provider.getBalance(_account);
                setBalance(ethers.formatEther(_balance));

                const network = await _provider.getNetwork();
                setChainId(network.chainId.toString());

                await updateSigner(_provider, _account);

                // Auto-switch to Hoodi if requested, but for now we let users stay on their network
                // if (network.chainId.toString() !== '560048') {
                //     await switchNetwork();
                // }

            } catch (error) {
                console.error("Error connecting to MetaMask", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    const switchNetwork = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: HOODI_CHAIN_ID }],
                });
            } catch (switchError: any) {
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [HOODI_NETWORK_CONFIG],
                        });
                    } catch (addError) {
                        console.error("Failed to add network", addError);
                    }
                }
                console.error("Failed to switch network", switchError);
            }
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setBalance(null);
        setProvider(null);
        setSigner(null);
        setChainId(null);
    };

    useEffect(() => {
        if (window.ethereum) {
            const handleAccountsChanged = async (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    if (provider) {
                        const _balance = await provider.getBalance(accounts[0]);
                        setBalance(ethers.formatEther(_balance));
                        await updateSigner(provider, accounts[0]);
                    }
                } else {
                    disconnectWallet();
                }
            };

            const handleChainChanged = (chainId: string) => {
                setChainId(chainId);
                window.location.reload();
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, [provider]);

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                try {
                    const _provider = new ethers.BrowserProvider(window.ethereum);
                    const accounts = await _provider.listAccounts();
                    if (accounts.length > 0) {
                        const _account = accounts[0].address;
                        setAccount(_account);
                        setProvider(_provider);

                        const _balance = await _provider.getBalance(_account);
                        setBalance(ethers.formatEther(_balance));

                        const network = await _provider.getNetwork();
                        setChainId(network.chainId.toString());

                        await updateSigner(_provider, _account);
                    }
                } catch (e) {
                    console.error("Auto-connect check failed", e);
                }
            }
        };
        checkConnection();
    }, []);

    return (
        <WalletContext.Provider
            value={{
                account,
                balance,
                provider,
                signer,
                connectWallet,
                disconnectWallet,
                isConnected: !!account,
                chainId
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = (): WalletContextType => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
