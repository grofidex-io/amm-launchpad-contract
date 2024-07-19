require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config();

const DEFAULT_COMPILER_SETTINGS = {
  version: "0.8.13",
  settings: {
    optimizer: {
      enabled: false,
      runs: 200,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};

const LOWEST_OPTIMIZER_COMPILER_SETTINGS = {
  version: "0.8.13",
  settings: {
    optimizer: {
      enabled: true,
      runs: 100,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};

module.exports = {
  solidity: {
    compilers: [DEFAULT_COMPILER_SETTINGS],
    overrides: {
      // "contracts/LaunchPadManager.sol": LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      "contracts/FactoryLaunchpadRound.sol": LOWEST_OPTIMIZER_COMPILER_SETTINGS,
    },
  },
  networks: {
    u2u: {
      url: `${process.env.UNI_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gasPrice: 8000000000,
    },
    bnb: {
      url: `${process.env.BNB_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gasPrice: 80000000000,
    },
    nebula: {
      url: `${process.env.NEL_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: {
      nebula: "EWXX7Z7H7XRCJDYDHBD2FVHUH1YSB3D457",
    },
    customChains: [
      {
        network: "nebula",
        chainId: 2484,
        urls: {
          apiURL: "https://testnet.u2uscan.xyz/api",
          browserURL: "https://testnet.u2uscan.xyz/"
        }
      }
    ]
  },
};
