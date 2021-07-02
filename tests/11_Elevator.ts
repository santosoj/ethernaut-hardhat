import {ethers} from 'hardhat'
import {Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0xaB4F3F2644060b2D960b0d88F0a42d1D27484687'
const INSTANCE_ADDRESS = '0x82370997758E088e8b7d5D25F548f711f57EB6FD'

describe('11 Elevator', () => {
  let ethernaut: Contract
  let instance: Contract
  let attack: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Elevator', INSTANCE_ADDRESS)

    const factory = await ethers.getContractFactory('ElevatorAttack')
    attack = await factory.deploy(instance.address);
    await attack.deployTransaction.wait()

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  it('calls goToTop on attack contract', async () => {
    const tx = await attack.goToTop();
    return expectStatusOK(tx);
  })

  it('verifies Elevator thinks it\'s at the top', async () => {
    expect(await instance.top()).to.be.true
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
