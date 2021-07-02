// Hardhat console startup that starts a Node REPL and injects commonly used things into context
// To be launched using the `console` script defined in `package.json`, which also sets Node's
// `--experimental-repl-await` option to enable top-level `await`.

import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {artifacts, ethers} from 'hardhat'
import {BigNumber, BigNumberish, ContractFactory, providers} from 'ethers'

type CustomContext = {
  signers: SignerWithAddress[]
  signer: SignerWithAddress
  provider: providers.Provider
  factories: {[name: string]: ContractFactory}
  formatEther: (wei: BigNumberish) => string
  parseEther: (ether: string) => BigNumber
}
;(async () => {
  process.stdout.write('Hardhat console startup...')

  const signers = await ethers.getSigners()
  const signer = signers[0]

  const artifactNames = await artifacts.getAllFullyQualifiedNames()
  const contractNames: string[] = artifactNames
    .map((n) => {
      const match = n.match(/.*:(.*)/)
      return match ? match[1] : undefined
    })
    .filter((n) => n !== undefined) as string[]

  // Get factories for all deployable contracts.
  const factories: {[name: string]: ContractFactory} = Object.assign(
    {},
    ...(
      await Promise.all(
        contractNames.map(async (n) => {
          try {
            return [n, await ethers.getContractFactory(n)] as [string, ContractFactory?]
          } catch {
            // Some contracts may be abstract.
            return [n, undefined] as [string, ContractFactory?]
          }
        })
      )
    )
      .filter((t) => t[1] !== undefined)
      .map((t) => ({[t[0]]: t[1]}))
  )

  const customCtx: CustomContext = {
    signers,
    signer,
    provider: signer.provider!,
    factories,
    formatEther: ethers.utils.formatEther,
    parseEther: ethers.utils.parseEther,
  }

  const repl = require('repl')
  const ctx = repl.start().context

  Object.assign(ctx, customCtx)
})()
