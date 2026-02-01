import { ethers } from "ethers";

const RPC = "https://rpc.hoodi.ethpandaops.io";
const ADDRESS = "0xB83f7B6F3b909f5F5b63579ce62d45AD2f60ef3e";

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC);
    const code = await provider.getCode(ADDRESS);
    console.log("Code at address:", code);

    if (code === "0x") {
        console.log("Verdict: CONTRACT DOES NOT EXIST (Empty)");
    } else {
        console.log("Verdict: CONTRACT EXISTS");
    }
}

main().catch(console.error);
