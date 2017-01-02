#!/usr/bin/env node

const args = require('./args')
const whale = require('../../libs/api.js')

let market = args.market || 'Poloniex'
let tokens = (args.tokens || 'ETH,BTC,ETC').split(/,/)
let format = args.format || "${t.name}: ${t.last}"
let delimiter = args.delimiter || ' | '

whale.getCurrentPrice(market, tokens).then((res) => {
  status = res.sort((t) => {
    return tokens.indexOf(t.name)
  }).map((t) => {
    return eval('`'+format+'`');
  }).join(delimiter)

  console.log(status)
}).catch(() => {
  // be silent
})
