const { coinbaseCurrentPrice, coinbasePriceTrend } = require('./fetch/coinbase')
const { poloniexCurrentPrice, poloniexPriceTrend } = require('./fetch/poloniex')
const { krakenCurrentPrice, krakenPriceTrend } = require('./fetch/kraken')
const { bitfinexCurrentPrice, bitfinexPriceTrend } = require('./fetch/bitfinex')
const { yunbiCurrentPrice, yunbiPriceTrend } = require('./fetch/yunbi')

// Coinbase
exports.coinbaseCurrentPrice = coinbaseCurrentPrice
exports.coinbasePriceTrend = coinbasePriceTrend

// Poloniex
exports.poloniexCurrentPrice = poloniexCurrentPrice
exports.poloniexPriceTrend = poloniexPriceTrend

// Kraken
exports.krakenCurrentPrice = krakenCurrentPrice
exports.krakenPriceTrend = krakenPriceTrend

// Bitfinex
exports.bitfinexCurrentPrice = bitfinexCurrentPrice
exports.bitfinexPriceTrend = bitfinexPriceTrend

// Yunbi
exports.yunbiCurrentPrice = yunbiCurrentPrice
exports.yunbiPriceTrend = yunbiPriceTrend
