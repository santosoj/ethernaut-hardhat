## Ethernaut Solutions
Solutions for the [Ethernaut](https://ethernaut.openzeppelin.com/) challenges implemented as Hardhat tests

Each test interacts with an instance of an Ethernaut level and submits the instance to the validator on successful completion. For some levels, there's an attack contract which is deployed by the test. Write‑ups were generated from commented code for each solution ― test or contract: in most cases, only one of them needed commenting ― and are available here:

| Level              | Test                         | Contract                                   |
|--------------------|------------------------------|--------------------------------------------|
| 01: Fallback       | [tests/01_Fallback.html][1]  | ―                                          |
| 02: Fallout        | [tests/02_Fallout.html][2]   | ―                                          |
| 03: Coin Flip      | [tests/03_CoinFlip.html][3]  | [contracts/03_CoinFlipAttack.html][23]     |
| 04: Telephone      | ―                            | [contracts/04_TelephoneAttack.html][4]     |
| 05: Token          | [tests/05_Token.html][5]     | ―                                          |
| 06: Delegation     | [tests/06_Delegation.html][6]| ―                                          |
| 07: Force          | ―                            | [contracts/07_ForceAttack.html][7]         |
| 08: Vault          | [tests/08_Vault.html][8]     | ―                                          |
| 09: King           | ―                            | [contracts/09_KingAttack.html][9]          |
| 10: Re-entrancy    | ―                            | [contracts/10_ReentranceAttack.html][10]   |
| 11: Elevator       | ―                            | [contracts/11_ElevatorAttack.html][11]     |
| 12: Privacy        | [tests/12_Privacy.html][12]  | ―                                          |
| 13: Gatekeeper One | ―                            | [contracts/13_GatekeeperOneAttack.html][13]|
| 14: Gatekeeper Two | ―                            | [contracts/14_GatekeeperTwoAttack.html][14]|
| 15: Naught Coin    | ―                            | [contracts/15_NaughtCoinAttack.html][15]   |
| 16: Preservation   | ―                            | [contracts/16_PreservationAttack.html][16] |
| 17: Recovery       | [tests/17_Recovery.html][17] | ―                                          |
| 18: MagicNumber    | ―                            | [contracts/18_MagicNumAttack.html][18]     |
| 19: Alien Codex    | [tests/19_AlienCodex.html][19] | ―                                        |
| 20: Denial         | ―                            | [contracts/20_DenialAttack.html][20]       |
| 21: Shop           | ―                            | [contracts/21_ShopAttack.html][21]         |
| 22: Dex            | [tests/22_Dex.html][22]      | ―                                          |

[1]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/tests/01_Fallback.html
[2]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/tests/02_Fallout.html
[3]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/tests/03_CoinFlip.html
[4]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/contracts/04_TelephoneAttack.html
[5]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/tests/05_Token.html
[6]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/tests/06_Delegation.html
[7]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/contracts/07_ForceAttack.html
[8]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/tests/08_Vault.html
[9]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/contracts/09_KingAttack.html
[10]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/contracts/10_ReentranceAttack.html
[11]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/contracts/11_ElevatorAttack.html
[12]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/tests/12_Privacy.html
[13]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/contracts/13_GatekeeperOneAttack.html
[14]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/contracts/14_GatekeeperTwoAttack.html
[15]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/contracts/15_NaughtCoinAttack.html
[16]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/contracts/16_PreservationAttack.html
[17]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/tests/17_Recovery.html
[18]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/contracts/18_MagicNumAttack.html
[19]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/tests/19_AlienCodex.html
[20]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/contracts/20_DenialAttack.html
[21]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/contracts/21_ShopAttack.html
[22]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/tests/22_Dex.html
[23]: https://htmlpreview.github.io/?https://github.com/santosoj/ethernaut-hardhat/blob/master/docs/contracts/03_CoinFlipAttack.html
