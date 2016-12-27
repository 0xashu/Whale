const sea = require('./sea')

exports.getCurrentPrice = function(exchange, markets) {
  return sea.getCurrentPrice(exchange, markets)
}

exports.getPriceTrend = function(exchange, currentMarket) {
  return sea.getPriceTrend(exchange, currentMarket)
}
