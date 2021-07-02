// # Ethernaut 17: Recovery

import {ethers} from 'hardhat'
import {BigNumber, Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0x8d07AC34D8f73e2892496c15223297e5B22B3ABE'
const INSTANCE_ADDRESS = '0xDf5fE3788E3B7A69387A2e2C72486265be51487a'

describe('17 Recovery', () => {
  let ethernaut: Contract
  let instance: Contract
  let token: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Preservation', INSTANCE_ADDRESS)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  // On contract creation, the new contract's address is calculated from the
  // creator's address and nonce. Here, the `Recovery` instance's constructor
  // creates the `SimpleToken`, so we know both the creator's address and nonce.
  // The nonce is 1, since this is the instance's first transaction.
  //
  // From these values, the 'forgotten' token contract address is calculated
  // as the last 20 bytes of the keccak256 hash of the RLP-coded address and nonce.
  // (Recursive Length Prefix coding is used in the EVM to serialize arbitrarily
  // nested arrays of binary data and is described e.g. [here](https://eth.wiki/fundamentals/rlp).)
  //
  // Once we know the token contract's address, we can attach the `SimpleToken` ABI
  // to it and call `destroy` to have the token contract send its remaining balance
  // to us by way of `selfdestruct`.

  it('calculates token address and and attaches to token', async () => {
    const rlp = ethers.utils.RLP.encode([instance.address, '0x01'])
    const hash = ethers.utils.keccak256(rlp)
    const tokenAddr = '0x' + hash.slice(26)
    token = await ethers.getContractAt('SimpleToken', tokenAddr)
    expect(await provider.getBalance(tokenAddr)).to.eq(ethers.utils.parseEther('0.5'))
  })

  it('calls destroy on token passing signer address', async () => {
    const tx = await token.destroy(signerAddress)
    return expectStatusOK(tx)
  })

  it('verifies token has zero balance', async () => {
    expect(await provider.getBalance(token.address)).to.eq(0)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
