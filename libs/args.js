const args = require('commander')

args
  .version('0.0.1')
  .description('Market Price')
  .option('-a, --auto-refresh', 'Add market auto refresh support (default 30s)')
  .option('-s, --seconds <number>', 'Add market auto refresh support', parseInt)

args.on('--help', () => {
  console.log('  Examples:')
  console.log('')
  console.log('    $ whale -a')
  console.log('    $ whale -a -s 60')
  console.log('')
})

args.parse(process.argv)

module.exports = args
