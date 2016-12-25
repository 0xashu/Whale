const request = require('superagent')
const exchangers = require('../config/exchangers')
const utils = require('./utils')

class Price {
  getCurrentPrice(exchange, markets) {
    if (this.hasMarkets(exchange, markets)) {
      return new Promise((resolve, reject) => {
        request(exchangers[exchange].ticker).end((err, res) => {
          if (!err) {
            const formatData = this.formatCurrentPrice(res.body, exchange, markets)
            resolve(formatData)
          } else {
            reject(err)
          }
        })
      })
    } else {
      console.error("Wrong market query name:" + market)
    }
  }

  getPriceTrendYUNBI(exchange, market) {
    // const ts = Math.round(new Date().getTime() / 1000)
    // const tsWeek = ts - (7 * 24 * 3600)
    return new Promise((resolve, reject) => {
      request(exchangers[exchange].kendpoint)
      .query({ market: exchangers[exchange].markets[market], period: 1440, limit: 30 })
      .end((err, res) => {
        if (!err) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
    })
  }

  getOpenPriceYUNBI(exchange, markets) {
    if (this.hasMarkets(exchange, markets)) {
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
    } else {
      console.error("Wrong market query name:" + market)
    }
  }

  getPriceTrend(exchange, market, period = 86400, start, end) {
    const ts = Math.round(new Date().getTime() / 1000)
    const tsMonth = ts - (30 * 24 * 3600)

    return new Promise((resolve, reject) => {
      request(exchangers[exchange].kendpoint)
      .query({ currencyPair: exchangers[exchange].markets[market], period: period, start: start || tsMonth, end: end || 9999999999 })
      .end((err, res) => {
        if (!err) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
    })
  }

  formatCurrentPrice(data = [], exchange, markets) {
    const formatData = []

    Object.keys(data).map((item) => {
      markets.map((market) => {
        if (item === exchangers[exchange].markets[market]) {
          const last = this.formatLast(exchange, data, item)
          const percentChange = this.formatPercentChange(exchange, data, item)

          formatData.push({
            name: market,
            last: `${exchangers[exchange].currency} ${last}`,
            percentChange: percentChange
          })
        }
      })
    })

    return formatData
  }

  formatLast(exchange, data, market) {
    let last = 0

    switch (exchange) {
      case 'Poloniex':
        last = data[market].last
        break;
      case 'Yunbi':
        last = data[market].ticker.last
        break;
      default:
        console.error('No current exchange')
    }

    return utils.formatDecimal(last, 2)
  }

  formatPercentChange(exchange, data, market) {
    let percentChange = 0

    switch (exchange) {
      case 'Poloniex':
        percentChange = data[market].percentChange
        break;
      case 'Yunbi':
        percentChange = 0
        break;
      default:
        console.error('No current exchange')
    }

    return percentChange
  }

  hasMarkets(exchange, markets) {
    const exchangeMarkets = Object.keys(exchangers[exchange].markets)

    markets.forEach((market) => {
      if (!exchangeMarkets.includes(market)) return false
    })

    return true
  }
}

module.exports = Price
