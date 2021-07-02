exports.configureHighlight = (highlightjs) => {
  const injectSolidity = require('highlightjs-solidity')
  injectSolidity(highlightjs)
}
