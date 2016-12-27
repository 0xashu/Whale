const request = require('superagent')
const format = require('../format')
const exchangers = require('../../config/exchangers')

// Poloniex
exports.poloniexCurrentPrice = function(exchange, markets) {
  return new Promise((resolve, reject) => {
    request(exchangers[exchange].ticker).end((err, res) => {
      if (!err) {
        const formatData = format.currentPrice(res.body, exchange, markets)
        resolve(formatData)
      } else {
        reject(err)
      }
    })
  })
}

exports.poloniexPriceTrend = function(exchange, market, since, period) {
  return new Promise((resolve, reject) => {
    request(exchangers[exchange].kendpoint)
    .query({ currencyPair: exchangers[exchange].markets[market], period: period, start: since })
    .end((err, res) => {
      if (!err) {
        const formatData = format.priceTrend(res.body, exchange, market)
        resolve(formatData)
      } else {
        reject(err)
      }
    })
  })
}
