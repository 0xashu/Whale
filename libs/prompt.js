const inquirer = require('inquirer')
const exchangers = require('./exchangers.json')

const prompt = new Promise((resolve, reject) => {
  inquirer.prompt({
    type: 'checkbox',
    name: 'market',
    message: 'Select your favorite market?',
    choices: ['POLONIEX', 'YUNBI'],
    validate: function (answer) {
      if (answer.length < 1) {
        return 'You must choose at least one market.'
      }
      return true
    }
  }).then((answer) => {
    inquirer.prompt({
      type: 'checkbox',
      name: 'pairs',
      message: 'And your favorite pairs?',
      choices: Object.keys(exchangers.pairs),
      validate: function (answer) {
        if (answer.length < 1) {
          return 'You must choose at least one pair.';
        }
        return true
      }
    }).then((answer) => {
      resolve(answer)
    })
  })
})

module.exports = prompt
