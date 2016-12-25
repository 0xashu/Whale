const utils = require('./utils')

exports.currentPrice = function(priceList) {
  return priceList.map((lastPrice) => {
    const change = lastPrice.percentChange.toString().charAt(0) === '-'
    ? `- ${utils.formatDecimal(-lastPrice.percentChange * 100, 2)}%`
    : `+ ${utils.formatDecimal(lastPrice.percentChange * 100, 2)}%`

    return [lastPrice.name, lastPrice.last, change]
  })
}

exports.priceTrend = function(currentMarket, data) {
  const closePrices = []
  const labels = []

  data.map((record) => {
    closePrices.push(record.close)
    labels.push(utils.formatDate(new Date(record.date * 1000), 'MM-dd'))
  })

  return {
    currentMarket,
    closePrices,
    labels
  }
}

// YUNBI
exports.currentPriceYUNBI = function(priceList, open) {
  const market = []

  priceList.map((lastPrice) => {
    open.map((openPrice) => {
      if (lastPrice.name === openPrice.name) {
        market.push({ name: lastPrice.name, last: lastPrice.last, open: openPrice.open })
      }
    })
  })

  return market.map((item) => {
    const change = (item.last - item.open).toString().charAt(0) === '-'
    ? `- ${utils.formatDecimal(-(item.last - item.open) / item.open * 100, 2)}%`
    : `+ ${utils.formatDecimal((item.last - item.open) / item.open * 100, 2)}%`

    return [item.name, item.last, change]
  })
}

exports.priceTrendYUNBI = function(currentMarket, data) {
  const closePrices = []
  const labels = []

  data.map((record) => {
    closePrices.push(record[1])
    labels.push(utils.formatDate(new Date(record[0] * 1000), 'MM-dd'))
  })

  return {
    currentMarket,
    closePrices,
    labels
  }
}
