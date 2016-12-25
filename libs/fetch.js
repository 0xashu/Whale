const request = require('superagent')
const format = require('./format')
const exchangers = require('../config/exchangers')

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
        const formatData = format.currentPrice(res.body, exchange, markets)
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

// Yunbi
exports.yunbiCurrentPrice = function(exchange, markets) {
  return new Promise((resolve, reject) => {
    Promise.all([
      yunbiLastPrice(exchange, markets),
      yunbiOpenPrice(exchange, markets)
    ]).then((res) => {

      const currentPriceList = []
      res[0].map((lastPrice) => {
        res[1].map((openPrice) => {
          if (lastPrice.name === openPrice.name) {
            currentPriceList.push({ name: lastPrice.name, last: lastPrice.last, percentChange: (lastPrice.last - openPrice.open) / openPrice.open })
          }
        })
      })

      resolve(currentPriceList)
    }).catch((err) => {
      reject(err)
    })
  })
}

exports.yunbiPriceTrend = function(exchange, market, since, period) {
  return new Promise((resolve, reject) => {
    request(exchangers[exchange].kendpoint)
    .query({ market: exchangers[exchange].markets[market], timestamp: since, period: period })
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

function yunbiLastPrice(exchange, markets) {
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

function yunbiOpenPrice(exchange, markets) {
  const openPriceList = []
  const tsOpen = new Date().setHours(0,0,0,0) / 1000

  const promiseList = markets.map((market) => {
    return new Promise((resolve, reject) => {
      request(exchangers[exchange].kendpoint)
      .query({ market: exchangers[exchange].markets[market], limit: 1, period: 1, timestamp: tsOpen })
      .end((err, res) => {
        if (!err) {
          resolve({ name: market, open: res.body[0][1] })
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
