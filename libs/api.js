const sea = require('./sea')

exports.getCurrentPrice = function(exchange, markets) {
  return new Promise((resolve) => {
    sea.getCurrentPrice(exchange, markets).then((data) => {

      // Reorder data to match specified markets order.
      let dataOrdered = [];
      markets.forEach(market => {
        for (var i=0; i<data.length; i++) {
          if (data[i].name === market) { dataOrdered.push(data[i]); break; }
        }
      });

      resolve(dataOrdered);
    });
  });
}

exports.getPriceTrend = function(exchange, currentMarket) {
  return sea.getPriceTrend(exchange, currentMarket)
}
