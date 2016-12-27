const utils = require('./utils')
const exchangers = require('../config/exchangers')

exports.currentPrice = function(res = {}, exchange, markets) {
  const currentPriceList = []

  Object.keys(res).map((item) => {
    markets.map((market) => {
      if (item === exchangers[exchange].markets[market]) {
        const last = formatLast(exchange, res, item)
        const percentChange = formatPercentChange(exchange, res, item)

        currentPriceList.push({
          name: market,
          last: last,
          percentChange: percentChange
        })
      }
    })
  })

  return currentPriceList
}

exports.priceTrend = function(res = [], exchange, currentMarket) {
  const closePricesList = []
  const labels = []

  res.map((record) => {
    closePricesList.push(formatClose(exchange, record))
    labels.push(utils.formatDate(new Date(formatDate(exchange, record) * 1000), 'MM-dd'))
  })

  return {
    currentMarket,
    closePricesList,
    labels
  }
}

function formatLast(exchange, data, market) {
  let last = 0

  switch (exchange) {
    case 'Poloniex':
      last = data[market].last
      break;
    case 'Kraken':
      last = data[market].c[0]
      break;
    case 'Bitfinex':
      last = data[6]
      break;
    case 'Yunbi':
      last = data[market].ticker.last
      break;
    default:
      throw new Error('No current exchange')
  }

  return utils.formatDecimal(last, 2)
}

function formatPercentChange(exchange, data, market) {
  let percentChange = 0

  switch (exchange) {
    case 'Poloniex':
      percentChange = data[market].percentChange
      break;
    case 'Kraken':
      percentChange = (data[market].c[0] - data[market].o) / data[market].o
      break;
    case 'Bitfinex':
      percentChange = data[5]
      break;
    case 'Yunbi':
      percentChange = 0
      break;
    default:
      throw new Error('No current exchange')
  }

  return percentChange
}

function formatClose(exchange, record) {
  let close = 0

  switch (exchange) {
    case 'Poloniex':
      close = record.close
      break;
    case 'Kraken':
      close = record[5]
      break;
    case 'Bitfinex':
      close = record[2]
      break;
    case 'Yunbi':
      close = record[2]
      break;
    default:
      throw new Error('No current exchange')
  }

  return close
}

function formatDate(exchange, record) {
  let date = 0

  switch (exchange) {
    case 'Poloniex':
      date = record.date
      break;
    case 'Kraken':
      date = record[0]
      break;
    case 'Bitfinex':
      date = record[0] / 1000
      break;
    case 'Yunbi':
      date = record[0]
      break;
    default:
      throw new Error('No current exchange')
  }

  return date
}
