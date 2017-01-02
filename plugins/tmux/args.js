const args = require('commander')

args
  .option('-m, --market <string>', 'Set favorite market')
  .option('-t, --tokens <string>', 'Set favorite token, comma-separated')
  .option('-f, --format <string>', 'Set custom format')
  .option('-d, --delimiter <string>', 'Set delimiter')

args.on('--help', () => {
  console.log('  Examples:')
  console.log('')
  console.log('    $ whale-tmux -m Yunbi -t \'ETH,BTC,ETC\' -f \'${t.name}: ${t.last}\' -d \' | \'')
  console.log('')
})

args.parse(process.argv)

module.exports = args
