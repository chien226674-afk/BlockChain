import React from 'react';
import { useWallet } from '../../context/WalletContext';
import { Button } from './button'; // Assuming you have a shadcn/ui button or similar
import { Loader2, Wallet } from 'lucide-react';

export const ConnectWalletButton: React.FC = () => {
    const { account, connectWallet, isConnected } = useWallet();
    const [isConnecting, setIsConnecting] = React.useState(false);

    const handleConnect = async () => {
        setIsConnecting(true);
        await connectWallet();
        setIsConnecting(false);
    };

    if (isConnected && account) {
        return (
            <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg border border-border">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-sm font-medium">
                    {account.slice(0, 6)}...{account.slice(-4)}
                </span>
            </div>
        );
    }

    return (
        <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all shadow-lg hover:shadow-primary/25"
        >
            {isConnecting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                </>
            ) : (
                <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                </>
            )}
        </Button>
    );
};
