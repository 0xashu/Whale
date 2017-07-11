const inquirer = require('inquirer');

let exchangeSelected = ''

const prompt = (exchangers, allMarkets) => {
  return new Promise((resolve, reject) => {
    // Default to pick the first/only exchange.
    let exchangeSelect = new Promise((resolve) => {
      resolve({
        exchange: Object.keys(exchangers)[0],
        autoSelected: true
      });
    });

    // Let user select if there are multiple exchanges.
    if (Object.keys(exchangers).length > 1) {
      exchangeSelect = inquirer.prompt({
        type: 'list',
        name: 'exchange',
        message: 'Select your favorite exchange',
        choices: Object.keys(exchangers)
      });
    }

    exchangeSelect.then((answer) => {
      exchangeSelected = answer.exchange

      // Continue with all markets.
      if (allMarkets) {
        return resolve({
          exchange: exchangeSelected,
          markets: Object.keys(exchangers[answer.exchange].markets)
        });
      }

      // Let use select markets.
      let marketsSelect = inquirer.prompt({
        type: 'checkbox',
        name: 'markets',
        message: 'And your favorite market',
        choices: Object.keys(exchangers[answer.exchange].markets),
        validate: function (answer) {
          if (answer.length < 1) {
            return 'You must choose at least one market.';
          }
          return true
        }
      });

      marketsSelect.then((answer) => {
        // FIXME: Manually remove stdin listener. Inquirer somehow fails to do
        // so, and we'll end up with double keypresses in the blessed interface.
        process.stdin.removeAllListeners('data');

        resolve({
          exchange: exchangeSelected,
          markets: answer.markets
        })
      })
    })
  })
}

module.exports = prompt
