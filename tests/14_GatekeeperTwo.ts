import {ethers} from 'hardhat'
import {Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect} from './testUtil'

const LEVEL_ADDRESS = '0xdCeA38B2ce1768E1F409B6C65344E81F16bEc38d'
const INSTANCE_ADDRESS = '0x728770366F53816125C90dc4Ed2e4B4cfd1DA820'

describe('14 Gatekeeper Two', () => {
  let ethernaut: Contract
  let instance: Contract
  let attack: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('GatekeeperTwo', INSTANCE_ADDRESS)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  it('deploys attack contract mounting attack in constructor', async () => {
    const factory = await ethers.getContractFactory('GatekeeperTwoAttack')
    attack = await factory.deploy(instance.address)
    await attack.deployTransaction.wait()
  })

  it('verifies signer is entrant', async () => {
    expect(await instance.entrant()).to.eq(signerAddress)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
