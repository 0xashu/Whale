const request = require('superagent')
const exchangers = require('./exchangers')

class Price {
  fetch(pairs) {
    if (this.hasPairs(pairs)) {
      return new Promise((resolve, reject) => {
        request(exchangers.endpoint).end((err, res) => {
          if (!err) {
            const formatData = this.wash(res.body, pairs)
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

  wash(data = [], pairs) {
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
