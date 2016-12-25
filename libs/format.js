const utils = require('./utils')
const exchangers = require('../config/exchangers')

exports.currentPrice = function(res = {}, exchange, markets) {
  const currentPriceList = []
  const data = exchange === 'Kraken' ? res.result : res

  Object.keys(data).map((item) => {
    markets.map((market) => {
      if (item === exchangers[exchange].markets[market]) {
        const last = formatLast(exchange, data, item)
        const percentChange = formatPercentChange(exchange, data, item)

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
    case 'Yunbi':
      last = data[market].ticker.last
      break;
    default:
      console.error('No current exchange')
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
    case 'Yunbi':
      percentChange = 0
      break;
    default:
      console.error('No current exchange')
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
    case 'Yunbi':
      close = record[2]
      break;
    default:
      console.error('No current exchange')
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
    case 'Yunbi':
      date = record[0]
      break;
    default:
      console.error('No current exchange')
  }

  return date
}
