const utils = require('./utils')

exports.currentPrice = function(exchange, priceList) {
  return priceList.map((price) => {
    const change = price.percentChange.toString().charAt(0) === '-'
    ? `- ${utils.formatDecimal(-price.percentChange * 100, 2)}%`
    : `+ ${utils.formatDecimal(price.percentChange * 100, 2)}%`

    const last = `${exchange.currency} ${price.last}`

    return [price.name, last, change]
  })
}
