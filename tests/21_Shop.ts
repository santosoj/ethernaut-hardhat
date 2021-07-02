import {ethers} from 'hardhat'
import {Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0xBE732789f2963E0522719F2D3fB55E6bfe07e92e'
const INSTANCE_ADDRESS = '0x708fA82359E24DB720C75f9b4D202Ad12D0E45Be'

describe('21 Shop', () => {
  let ethernaut: Contract
  let instance: Contract
  let attack: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Shop', INSTANCE_ADDRESS)

    const factory = await ethers.getContractFactory('ShopAttack')
    attack = await factory.deploy()
    await attack.deployTransaction.wait()

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  it('lets attack contract call Shop.buy', async () => {
    const params = {
      to: attack.address,
      gasLimit: 100000
    }
    const tx = await signer.sendTransaction(params)
    return expectStatusOK(tx)
  })

  it('verifies item was sold for less than initial price', async () => {
    expect(await instance.isSold()).to.be.true
    expect(await instance.price()).to.be.lt(100)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
