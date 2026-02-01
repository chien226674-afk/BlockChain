require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mezo: {
      url: process.env.RPC_URL || "https://rpc.testnet.mezo.org",
      chainId: 20170,
      accounts: ["003cd7d141bfdd6e2663c2304e6442c3478ea0cc18ce2de456341d3c7a3661c9"]
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