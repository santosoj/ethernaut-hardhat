import {ethers} from 'hardhat'
import {Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0x9b261b23cE149422DE75907C6ac0C30cEc4e652A'
const INSTANCE_ADDRESS = '0x8A1AF7D0989b498c3C81f2c5FFDe35909cC31D6e'

describe('13 Gatekeeper One', () => {
  let ethernaut: Contract
  let instance: Contract
  let attack: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('GatekeeperOne', INSTANCE_ADDRESS)

    const factory = await ethers.getContractFactory('GatekeeperOneAttack')
    attack = await factory.deploy(instance.address)
    await attack.deployTransaction.wait()

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  it('calls passGate on attack contract', async () => {
      const tx = await attack.passGate({ gasLimit: 150000 })
      return expectStatusOK(tx)
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
