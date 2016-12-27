const request = require('superagent')
const format = require('../format')
const exchangers = require('../../config/exchangers')

// Bitfinex
exports.bitfinexCurrentPrice = function(exchange, markets) {
  const marketPairs = []

  markets.map((item) => {
    Object.keys(exchangers[exchange].markets).map((market) => {
      if (item === market) {
        marketPairs.push([exchangers[exchange].markets[market], market])
      }
    })
  })

  const promiseList = marketPairs.map((market) => {
    return new Promise((resolve, reject) => {
      request(`${exchangers[exchange].ticker}/${market[0]}`)
      .end((err, res) => {
        if (!err) {
          resolve({ name: market[1], last: res.body[6], percentChange: res.body[5]})
        } else {
          reject(err)
        }
      })
    })
  })

  return new Promise((resolve, reject) => {
    Promise.all(promiseList).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

exports.bitfinexPriceTrend = function(exchange, market, since, period) {
  return new Promise((resolve, reject) => {
    request(`${exchangers[exchange].kendpoint}:${period}:${exchangers[exchange].markets[market]}/hist`)
    .query({ start: since })
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
