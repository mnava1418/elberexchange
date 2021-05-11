require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider-privkey')

const PRIVATE_KEYS = process.env.PRIVATE_KEYS
const INFURA_KEY = process.env.INFURA_KEY


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(
          PRIVATE_KEYS.split(','),
          `https://kovan.infura.io/v3/${INFURA_KEY}`
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    }
  },

  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.0",
      optimizer: {
        enabled: false,
        runs: 200
      },
    },
  },
};
