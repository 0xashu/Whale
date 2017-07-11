const request = require('superagent')
const format = require('../format')

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
    request(exchange.kendpoint)
    .query({ market: exchange.markets[market], timestamp: since, period: period })
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
    request(exchange.ticker).end((err, res) => {
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
      request(exchange.kendpoint)
      .query({ market: exchange.markets[market], limit: 1, period: 1, timestamp: tsOpen })
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
