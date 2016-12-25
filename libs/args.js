const args = require('commander')

args
  .version('0.0.1')
  .description('Whales, a crypto-currency market price board for geeks')
  .option('-s, --seconds <number>', 'Set auto refresh time', parseInt)

args.on('--help', () => {
  console.log('  Examples:')
  console.log('')
  console.log('    $ whale -h')
  console.log('    $ whale -s 60')
  console.log('')
})

args.parse(process.argv)

module.exports = args
