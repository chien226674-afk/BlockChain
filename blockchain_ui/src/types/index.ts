export interface User {
    _id: string;
    username: string;
    email?: string;
    walletAddress?: string;
    avatar?: string;
    bio?: string;
    role: 'user' | 'admin';
}

export interface NFT {
    _id: string;
    tokenId: string;
    name: string;
    description: string;
    image: string;
    tokenURI: string;
    owner?: User | string;
    creator?: User | string;
    price?: number; // From market
    isListed?: boolean;
    itemId?: string; // itemId from contract
    contractAddress: string;
}

export interface MarketItem {
    itemId: string;
    nft: NFT;
    seller: User;
    price: number;
    sold: boolean;
}
