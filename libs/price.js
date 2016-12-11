const request = require('superagent')
const exchangers = require('../config/exchangers')

class Price {
  getCurrentPrice(pairs) {
    if (this.hasPairs(pairs)) {
      return new Promise((resolve, reject) => {
        request(exchangers.endpoint).end((err, res) => {
          if (!err) {
            const formatData = this.filterCurrentPrice(res.body, pairs)
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

  getOpenPrice(pairs) {
    if (this.hasPairs(pairs)) {
      const openPriceList = []
      const tsOpen = new Date().setHours(0,0,0,0) / 1000

      const promiseList = pairs.split(',').map((pair) => {
        return new Promise((resolve, reject) => {
          request(exchangers.kendpoint)
          .query({ market: pair + 'cny', limit: 1, period: 1, timestamp: tsOpen })
          .end((err, res) => {
            if (!err) {
              resolve({ name: pair, open: res.body[0][1] })
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

  getPriceTrend(pair) {
    // const ts = Math.round(new Date().getTime() / 1000)
    // const tsWeek = ts - (7 * 24 * 3600)

    return new Promise((resolve, reject) => {
      request(exchangers.kendpoint)
      .query({ market: pair + 'cny', period: 1440, limit: 30 })
      .end((err, res) => {
        if (!err) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
    })
  }

  filterCurrentPrice(data = [], pairs) {
    const formatData = []

    Object.keys(data).map((item) => {
      pairs.split(',').map((pair) => {
        if (item === pair + 'cny') {
          formatData.push({
            name: pair,
            last: data[item].ticker.last,
          })
        }
      })
    })

    return formatData
  }

  hasPairs(pairs) {
    const exchangePairs = Object.keys(exchangers.pairs)

    pairs.split(',').forEach((pair) => {
      if (!exchangePairs.includes(pair)) return false
    })

    return true
  }
}

module.exports = Price
