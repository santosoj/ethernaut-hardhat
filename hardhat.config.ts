/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import '@nomiclabs/hardhat-waffle'

const RINKEBY_ALCHEMY_API_KEY = ''
const RINKEBY_ACCOUNTS = ['']

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.6.0',
        settings: {
          outputSelection: {
            '*': {
              '*': ['abi', 'storageLayout', 'evm.methodIdentifiers'],
            },
          },
        },
      },
      {
        version: '0.5.0',
        settings: {
          outputSelection: {
            '*': {
              '*': ['abi', 'storageLayout', 'evm.methodIdentifiers'],
            },
          },
        },
      },
    ],
  },
  defaultNetwork: 'rinkeby',
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${RINKEBY_ALCHEMY_API_KEY}`,
      accounts: RINKEBY_ACCOUNTS,
    },
  },
  mocha: {
    bail: true,
    timeout: '600s',
  },
}
