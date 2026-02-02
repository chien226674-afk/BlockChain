---
description: How to deploy contracts to Cronos Testnet and fix TokenID error
---

### Step 1: Add Private Key
Open [backend/.env](file:///e:/Blockchain_pj/BlockChain/backend/.env) and add your MetaMask private key:
```env
PRIVATE_KEY=your_metamask_private_key_here
```
> [!WARNING]
> Never share your private key or commit this file to GitHub!

### Step 2: Deploy Contracts
Run this command in your terminal (inside the `smart_contracts` directory):
// turbo
```powershell
npx hardhat run scripts/deploy.js --network cronosTestnet
```

### Step 3: Update Frontend
Copy the new addresses from the terminal output and update [contract.ts](file:///e:/Blockchain_pj/BlockChain/blockchain_ui/src/services/contract.ts):
```typescript
export const NFT_ADDRESS = "NEW_NFT_ADDRESS";
export const MARKET_ADDRESS = "NEW_MARKET_ADDRESS";
```

### Step 4: Verify
Try minting a new NFT again. The TokenID error should be resolved!
