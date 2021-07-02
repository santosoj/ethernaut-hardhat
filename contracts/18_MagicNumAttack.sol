// # Ethernaut 18: MagicNumber
//
// The solver's `whatIsTheMeaningOfLife` function just needs to return 42,
// but it needs to do it in at most 10 bytes of code. Becaose Solidity adds
// too much boilerplate, we need to create the bytecode in a different way.
//
// At a size of 10 bytes, it wouldn't be too hard to handwrite the bytecode
// with the help of an opcode table, as the level description suggests. However,
// there's a more comfortable way: the tools that come with *geth* include
// *evm* which may be used as an EVM assembler.
//
// We'll write a contract that doesn't do anything except return the number 42.
// Note that since the contract doesn't look at the call data at all, it does
// the same regardless of what call data is sent: it doesn't need to be the
// function signature of `whatIsTheMeaningOfLife`.
//
/*
push 42
push 0
mstore
push 32
push 0
return
*/
// That's all we need to do:
//   - Store the value 42 at memory address 0.
//   - Return 32 bytes beginning from memory address 0. (`mstore` stores a 256-bit word.)
// Putting above code in a file and processing it with `evm compile` yields the following
// bytecode:
/*
602a60005260206000f3
*/
// It's ten bytes long: just the size we need. But in order to deploy it as a
// contract, we need to wrap it in a deployment bytecode. The deployment bytecode
// is the code which, when executed by the EVM, returns our contract's bytecode.
// Again, an `mstore` followed by `return` will do the job. Note that we specify
// a start address of `0x16` for `return`, since our contract occupies only the
// last 10 bytes of the 256-bit word at memory address 0.
/*
push 0x602a60005260206000f3
push 0
mstore
push 10
push 0x16
return
*/
// This yields the deployment bytecode:
/*
69602a60005260206000f3600052600a6016f3
*/
// Sending a transaction with the deployment bytecode in the `data` field, and
// without a `to` field, creates the new contract on the blockchain. The new
// contract's address is calculated from the sender's address and  transaction nonce
// (which is identical with the count of transactions the sender has sent).
// `ethers.js` puts it in the `creates` field of the `TransactionResponse` for
// a transaction that creates a contract.
