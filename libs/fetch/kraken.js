const request = require('superagent')
const format = require('../format')

// Kraken
exports.krakenCurrentPrice = function(exchange, markets) {
  const marketPairs = []
  markets.map((item) => {
    Object.keys(exchange.markets).map((market) => {
      if (item === market) {
        marketPairs.push(exchange.markets[market])
      }
    })
  })

  return new Promise((resolve, reject) => {
    request(exchange.ticker)
    .query({ pair: marketPairs.join(',') })
    .end((err, res) => {
      if (!err) {
        const formatData = format.currentPrice(res.body.result, exchange, markets)
        resolve(formatData)
      } else {
        reject(err)
      }
    })
  })
}

exports.krakenPriceTrend = function(exchange, market, since, period) {
  const pair = exchange.markets[market]
  return new Promise((resolve, reject) => {
    request(exchange.kendpoint)
    .query({ pair: pair, since: since, interval: period })
    .end((err, res) => {
      if (!err) {
        const formatData = format.priceTrend(res.body.result[pair], exchange, market)
        resolve(formatData)
      } else {
        reject(err)
      }
    })
  })
}
