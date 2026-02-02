import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
    account: string | null;
    provider: ethers.BrowserProvider | null;
    signer: ethers.JsonRpcSigner | null;
    connectWallet: () => Promise<void>;
    isConnected: boolean;
    chainId: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [chainId, setChainId] = useState<string | null>(null);

    useEffect(() => {
        if (window.ethereum) {
            const p = new ethers.BrowserProvider(window.ethereum);
            setProvider(p);

            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    updateSigner(p);
                } else {
                    setAccount(null);
                    setSigner(null);
                }
            });

            window.ethereum.on('chainChanged', (id: string) => {
                setChainId(id);
                window.location.reload();
            });
        }
    }, []);

    const updateSigner = async (prov: ethers.BrowserProvider) => {
        const s = await prov.getSigner();
        setSigner(s);
    }

    const connectWallet = async () => {
        if (!provider) return;
        try {
            const accounts = await provider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
            await updateSigner(provider);
            const network = await provider.getNetwork();
            setChainId(network.chainId.toString());
        } catch (error) {
            console.error("Connection Failed", error);
        }
    };

    return (
        <WalletContext.Provider value={{ account, provider, signer, connectWallet, isConnected: !!account, chainId }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) throw new Error('useWallet must be used within a WalletProvider');
    return context;
};
