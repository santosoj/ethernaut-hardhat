// # Ethernaut 3: Coin Flip

import {ethers} from 'hardhat'
import {Contract, Signer} from 'ethers'

import {ETHERNAUT_ADDRESS, expect} from './testUtil'

const LEVEL_ADDRESS = '0x4dF32584890A0026e56f7535d0f2C6486753624f'
const INSTANCE_ADDRESS = '0x61fE059fcFAf734AC5b7ea5AEBAEcDC1c6A8973b'

describe('03_Coin Flip', () => {
  let ethernaut: Contract
  let instance: Contract
  let attack: Contract
  let signer: Signer
  let signerAddress: string

  before(async () => {
    ethernaut = await ethers.getContractAt('Ethernaut', ETHERNAUT_ADDRESS)
    instance = await ethers.getContractAt('CoinFlip', INSTANCE_ADDRESS)

    const factory = await ethers.getContractFactory('CoinFlipAttack')
    attack = await factory.deploy(instance.address)

    const signers = await ethers.getSigners()
    signer = signers[0]
    signerAddress = await signer.getAddress()
  })

  it('guesses right using attack contract 10 times', async () => {
    const progressMsg = (i: number, check?: boolean) => {
      process.stdout.write(
        `Guess ${String(i + 1).padStart(2, '0')}${check ? '✔\n' : '◉'} \r`
      )
    }

    // Ten consecutive wins are needed to pass this level. We wait for the transaction
    // to be included in the chain for one block each time to ensure `flip` doesn't
    // revert due to calling it more than one time on the same block.
    for (let i = 0; i < 10; i++) {
      progressMsg(i)
      const tx = await attack.doFlip({gasLimit: 100000})
      const rcpt = await tx.wait()
      expect(rcpt.events.length).to.equal(1)
      progressMsg(i, true)
    }
  })

  it('verifies consecutiveWins >= 10', async () => {
    expect(await instance.consecutiveWins()).to.be.gte(10)
  })

  it('is validated', async () => {
    return expect(ethernaut.submitLevelInstance(instance.address, {gasLimit:100000}))
      .to.emit(ethernaut, 'LevelCompletedLog')
      .withArgs(signerAddress, LEVEL_ADDRESS).eventually
  })
})
