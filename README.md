# Whale

> Show Ethereum and Bitcoin price in command line interface (CLI).

### Install
```
$ npm install whale-cli -g
```

### Usage
```
$ whale --help

Usage: whale [options]

Whale, show Ethereum and Bitcoin price in command line interface (CLI).

Options:

  -h, --help              output usage information
  -V, --version           output the version number
  -s, --seconds <number>  Set auto refresh time

Examples:

  $ whale
  $ whale -h
  $ whale -s 60
```

### Interactive UI
Run `whale` without arguments to launch the interactive UI that guides you through showing market price.


### API
```javascript
const whale = require('whale-cli')

/**
 *
 * @param {String} exchange
 * @param {Array} markets
 */
whale.getCurrentPrice('Poloniex', ['BTC', 'ETH', 'ZEC']).then((res) => {
  console.log(res)
})

/**
 * @param {String} exchange
 * @param {String} market
 * @param {Number} since
 * @param {Number} period
 */
whale.getPriceTrend('Yunbi', 'ETH').then((res) => {
  console.log(res)
})
```

### Supported Exchanges
- [Poloniex](https://poloniex.com)
- [Kraken](https://kraken.com)
- [Yunbi](https://yunbi.com)
- [Coinbase](https://coinbase.com/)
- [Bitfinex](https://bitfinex.com/)
