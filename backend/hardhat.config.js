import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

export default {
    solidity: "0.8.19",
    networks: {
        hardhat: {
            chainId: 1337
        },
        hoodi: {
            url: "https://rpc.hoodi.ethpandaops.io",
            chainId: 560048,
            accounts: ["0x838165a59d57a8b3365a704c6933cbd4fbf2d9afe584497395789d3426b6c685"]
        },
        localhost: {
            url: "http://127.0.0.1:8545"
        }
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    }
};
