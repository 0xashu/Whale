const request = require('superagent')
const format = require('../format')
const exchangers = require('../../config/exchangers')

// Kraken
exports.krakenCurrentPrice = function(exchange, markets) {
  const marketPairs = []
  markets.map((item) => {
    Object.keys(exchangers[exchange].markets).map((market) => {
      if (item === market) {
        marketPairs.push(exchangers[exchange].markets[market])
      }
    })
  })

  return new Promise((resolve, reject) => {
    request(exchangers[exchange].ticker)
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
  const pair = exchangers[exchange].markets[market]
  return new Promise((resolve, reject) => {
    request(exchangers[exchange].kendpoint)
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
