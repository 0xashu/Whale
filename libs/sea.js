const exchangers = require('../config/exchangers')
const fetch = require('./fetch')

exports.getCurrentPrice = function(exchange, markets) {
  if (hasMarkets(exchange, markets)) {
    switch (exchange) {
      case 'Poloniex':
        return fetch.poloniexCurrentPrice(exchange, markets)
      case 'Kraken':
        return fetch.krakenCurrentPrice(exchange, markets)
      case 'Yunbi':
        return fetch.yunbiCurrentPrice(exchange, markets)
      default:
        console.error("Wrong exchange query name:" + exchange)
    }
  } else {
    console.error("Wrong market query name:" + market)
  }
}

exports.getPriceTrend = function(exchange, market, customSince, customPeriod) {
  const defaultSince = Math.round(new Date().getTime() / 1000) - (30 * 24 * 3600)
  const defaultPeriod = exchange === 'Poloniex' ? 86400 : 1440
  const since = customSince || defaultSince
  const period = customPeriod || defaultPeriod

  if (hasMarkets(exchange, market)) {
    switch (exchange) {
      case 'Poloniex':
        return fetch.poloniexPriceTrend(exchange, market, since, period)
      case 'Kraken':
        return fetch.krakenPriceTrend(exchange, market, since, period)
      case 'Yunbi':
        return fetch.yunbiPriceTrend(exchange, market, since, period)
      default:
        console.error("Wrong exchange query name:" + exchange)
    }
  } else {
    console.error("Wrong market query name:" + market)
  }
}

function hasMarkets(exchange, markets) {
  const exchangeMarkets = Object.keys(exchangers[exchange].markets)

  if (typeof markets === 'array') {
    markets.forEach((market) => {
      if (!exchangeMarkets.includes(market)) return false
    })
  }

  if (typeof markets === 'string') {
    if (!exchangeMarkets.includes(markets)) return false
  }

  return true
}
