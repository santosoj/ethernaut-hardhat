import {ethers} from 'hardhat'
import {BigNumber, Contract, providers, Signer} from 'ethers'
import {TransactionResponse} from '@ethersproject/providers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0x200d3d9Ac7bFd556057224e7aEB4161fED5608D0'
const INSTANCE_ADDRESS = '0x48F2f1C55f86a066beDD96FC51237a1caFAE9B4E'

describe('18 MagicNumber', () => {
  let ethernaut: Contract
  let instance: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  let solverAddress: string

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('MagicNum', INSTANCE_ADDRESS)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  it('deploys solver contract from bytecode', async () => {
    const deployBytecode = '0x69602a60005260206000f3600052600a6016f3'
    const params = {data: deployBytecode}
    const tx = (await signer.sendTransaction(params)) as TransactionResponse & {creates: string}
    solverAddress = tx.creates
    return expectStatusOK(tx)
  })

  it('verifies solver returns 42', async () => {
    expect(BigNumber.from(await signer.call({to: solverAddress}))).to.eq(42)
  })

  it('sets solver address on instance', async () => {
    const tx = await instance.setSolver(solverAddress)
    return expectStatusOK(tx)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
