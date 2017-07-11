const request = require('superagent')
const format = require('../format')

// Coinbase
exports.coinbaseCurrentPrice = function(exchange, markets) {
  return new Promise((resolve, reject) => {
    Promise.all([
      coinbaseLastPrice(exchange, markets),
      coinbaseOpenPrice(exchange, markets)
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

exports.coinbasePriceTrend = function(exchange, market, since, period) {
  const end = new Date().toISOString()
  return new Promise((resolve, reject) => {
    request(`${exchange.kendpoint}/${exchange.markets[market]}/candles`)
    .query({ start: since, end: end, granularity: period })
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

function coinbaseLastPrice(exchange, markets) {
  const marketPairs = []

  markets.map((item) => {
    Object.keys(exchange.markets).map((market) => {
      if (item === market) {
        marketPairs.push([exchange.markets[market], market])
      }
    })
  })

  const promiseList = marketPairs.map((market) => {
    return new Promise((resolve, reject) => {
      request(`${exchange.ticker}/${market[0]}/ticker`)
      .end((err, res) => {
        if (!err) {
          resolve({ name: market[1], last: res.body.price, percentChange: 0})
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

function coinbaseOpenPrice(exchange, markets) {
  const openPriceList = []
  const tsOpen = new Date().setHours(0,0,0,0) / 1000

  const promiseList = markets.map((market) => {
    return new Promise((resolve, reject) => {
      request(`${exchange.kendpoint}/${exchange.markets[market]}/candles`)
      .query({ start: tsOpen, granularity: 86400 })
      .end((err, res) => {
        if (!err) {
          resolve({ name: market, open: res.body[0][3] })
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
