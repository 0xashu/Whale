const exchangers = require('../config/exchangers')
const fetch = require('./fetch')

exports.getCurrentPrice = function(exchange, markets) {
  if (!exchange instanceof String) {
    return Promise.reject('TypeError: exchange should be an string type')
  }

  if (!markets instanceof Array) {
    return Promise.reject('TypeError: markets should be an array type')
  }

  if (hasMarkets(exchange, markets)) {
    switch (exchange) {
      case 'Poloniex':
        return fetch.poloniexCurrentPrice(exchange, markets)
      case 'Kraken':
        return fetch.krakenCurrentPrice(exchange, markets)
      case 'Bitfinex':
        return fetch.bitfinexCurrentPrice(exchange, markets)
      case 'Coinbase':
        return fetch.coinbaseCurrentPrice(exchange, markets)
      case 'Yunbi':
        return fetch.yunbiCurrentPrice(exchange, markets)
      default:
        return Promise.reject("Wrong exchange query name:" + exchange)
    }
  } else {
    return Promise.reject("Wrong markets query name:" + markets)
  }
}

exports.getPriceTrend = function(exchange, market, customSince, customPeriod) {
  if (!exchange instanceof String) {
    return Promise.reject('TypeError: exchange should be an string type')
  }

  if (!market instanceof String) {
    return Promise.reject('TypeError: market should be an string type')
  }

  const defaultSince = filterDefaultSince(exchange)
  const defaultPeriod = filterDefaultPeriod(exchange)
  const since = customSince || defaultSince
  const period = customPeriod || defaultPeriod

  if (hasMarkets(exchange, market)) {
    switch (exchange) {
      case 'Poloniex':
        return fetch.poloniexPriceTrend(exchange, market, since, period)
      case 'Kraken':
        return fetch.krakenPriceTrend(exchange, market, since, period)
      case 'Bitfinex':
        return fetch.bitfinexPriceTrend(exchange, market, since, period)
      case 'Coinbase':
        return fetch.coinbasePriceTrend(exchange, market, since, period)
      case 'Yunbi':
        return fetch.yunbiPriceTrend(exchange, market, since, period)
      default:
        return Promise.reject("Wrong exchange query name:" + exchange)
    }
  } else {
    return Promise.reject("Wrong market query name:" + market)
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

function filterDefaultSince(exchange) {
  const monthAgoSencond =  Math.round(new Date().getTime() / 1000) - (30 * 24 * 3600)
  const monthAgoMilliSecond = Math.round(new Date().getTime()) - (30 * 24 * 3600 * 1000)
  let since = monthAgoSencond

  switch (exchange) {
    case 'Poloniex':
      since = monthAgoSencond
      break;
    case 'Kraken':
      since = monthAgoSencond
      break;
    case 'Bitfinex':
      since = monthAgoMilliSecond
      break;
    case 'Coinbase':
      since = new Date(monthAgoSencond * 1000).toISOString()
      break;
    case 'Yunbi':
      since = monthAgoSencond
      break;
    default:
      since = monthAgoSencond
  }

  return since
}

function filterDefaultPeriod(exchange) {
  let period = 1440

  switch (exchange) {
    case 'Poloniex':
      period = 86400 // 86400 / 60 / 60 = 24
      break;
    case 'Kraken':
      period = 1440 // 1440 / 60 = 24
      break;
    case 'Bitfinex':
      period = '1D'
      break;
    case 'Coinbase':
      period = 86400
      break;
    case 'Yunbi':
      period = 1440 // 1440 / 60 = 24
      break;
    default:
      period = 1440
  }

  return period
}
