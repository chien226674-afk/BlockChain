export const MezoTestnet = {
  chainId: "0x4EE2", // 20170 in hex
  chainName: "Mezo Testnet",
  nativeCurrency: {
    name: "Bitcoin",
    symbol: "BTC",
    decimals: 18
  },
  rpcUrls: ["https://drpc.org/chainlist/mezo-testnet-rpc"],
  blockExplorerUrls: ["https://explorer-testnet.mezo.org/"]
};

export async function addMezoToMetamask() {
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [MezoTestnet]
    });
    return { success: true };
  } catch (error) {
    console.error("Error adding Mezo network:", error);
    return { success: false, error };
  }
}

export async function switchToMezoNetwork() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: MezoTestnet.chainId }]
    });
    return { success: true };
  } catch (error) {
    if (error.code === 4902) {
      // Chain not added, try to add it
      return await addMezoToMetamask();
    }
    return { success: false, error };
  }
}