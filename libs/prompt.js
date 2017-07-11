const inquirer = require('inquirer');

let exchangeSelected = ''

const prompt = (exchangers, allMarkets) => {
  return new Promise((resolve, reject) => {
    // Continue with only configured market, or prompt user.
    let exchangeSelect;
    if (Object.keys(exchangers).length < 2) {
      exchangeSelect = new Promise((resolve) => {
        resolve({exchange: Object.keys(exchangers)[0]});
      });
    } else {
      exchangeSelect = inquirer.prompt({
        type: 'list',
        name: 'exchange',
        message: 'Select your favorite exchange?',
        choices: Object.keys(exchangers),
        validate: function (answer) {
          if (answer.length < 1) {
            return 'You must choose at least one exchange.'
          }
          return true
        }
      });
    }

    exchangeSelect.then((answer) => {
      exchangeSelected = answer.exchange

      // Continue with all markets or prompt user.
      if (allMarkets) {
        return resolve({
          exchange: exchangeSelected,
          markets: Object.keys(exchangers[answer.exchange].markets)
        });
      }

      inquirer.prompt({
        type: 'checkbox',
        name: 'markets',
        message: 'And your favorite market?',
        choices: Object.keys(exchangers[answer.exchange].markets),
        validate: function (answer) {
          if (answer.length < 1) {
            return 'You must choose at least one market.';
          }
          return true
        }
      }).then((answer) => {
        resolve({
          exchange: exchangeSelected,
          markets: answer.markets
        })
      })
    })
  })
}

module.exports = prompt
