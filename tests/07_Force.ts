import {ethers} from 'hardhat'
import {Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0x22699e6AdD7159C3C385bf4d7e1C647ddB3a99ea'
const INSTANCE_ADDRESS = '0xae0bC02BcDf81911A9936CbeC5cC6B15019Eb0fb'

describe('07 Force', () => {
  let ethernaut: Contract
  let attack: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)

    const factory = await ethers.getContractFactory('ForceAttack')
    attack = await factory.deploy({value: ethers.utils.parseEther('0.0001')})

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  it('lets attack contract autodestruct', async () => {
      const tx = await attack.forceSendEther(INSTANCE_ADDRESS)
      return expectStatusOK(tx)
  })

  it('verifies instance has greater-than-zero balance', async () => {
      const blc = await provider.getBalance(INSTANCE_ADDRESS)
      expect(blc).to.be.gt(0)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(INSTANCE_ADDRESS, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
