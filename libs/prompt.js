const inquirer = require('inquirer');

let exchangeSelected = ''

const prompt = (exchangers) => {
  return new Promise((resolve, reject) => {
    inquirer.prompt({
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
    }).then((answer) => {
      exchangeSelected = answer.exchange

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
