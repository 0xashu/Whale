const blessed = require('blessed')
const contrib = require('blessed-contrib')
const Price = require('./libs/price')
const utils = require('./libs/utils')
const exchangers = require('./libs/exchangers')

class Whale {
  constructor(args, pairs) {
    this.screen = blessed.screen()
    this.grid = new contrib.grid({ rows: 12, cols: 12, screen: this.screen })
    this.price = new Price()
    this.cacheData

    this.fetchPrice(pairs).then((data) => {
      this.cacheData = data

      this.init(data)
      this.eventListeners(args, pairs)
    }).catch((err) => {
      console.error(err)
    })
  }

  fetchPrice(pairs) {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.price.fetch(pairs),
        this.price.openPrice(pairs),
      ]).then((res) => {
        resolve(this.washData(res[0], res[1]))
      }).catch((err) => {
        reject(err)
      })
    })
  }

  init(data, priceTrendData) {
    this.table = this.grid.set(0, 0, 6, 12, contrib.table,
      { keys: true
      , vi: true
      , fg: 'white'
      , selectedFg: 'white'
      , selectedBg: 'cyan'
      , interactive: true
      , label: 'Whale -- Market Price'
      , border: {type: "line", fg: "cyan"}
      , columnSpacing: 10
      , columnWidth: [10, 10, 10]})

    // this.line = this.grid.set(6, 0, 5, 12, contrib.line,
    //   { showNthLabel: 5
    //   , maxY: 100
    //   , label: 'Price Trend'
    //   , showLegend: true
    //   , legend: {width: 10}})

    this.log = this.grid.set(12, 0, 1, 12, contrib.log,
      { fg: "green"
      , selectedFg: "green"
      , label: 'Server Log'})

    this.createTable(data)
    // this.createLine(pair, priceTrendData)
    this.createLog(utils.formatCurrentTime())
  }

  eventListeners(args, pairs) {
    if (args.autoRefresh) {
      this.timer = setInterval(() => {
        this.createLog('Loading...')
        this.fetchPrice(pairs).then((data) => {
          this.cacheData = data
          this.init(data)
        }).catch((err) => {
          this.createLog(`Load failure: ${err}`)
        })
      }, 1000 * (Number.isInteger(args.seconds) ? args.seconds : 30))
    } else {
      this.timer && clearInterval(this.timer)
    }

    // this.table.rows.on('select', (item, selectedIndex) => {
    //   this.createLog(`${selectedIndex} selected`)
    //
    //   Object.keys(exchangers).forEach((item, index) => {
    //     if (selectedIndex === index) {
    //       this.updateLine(exchangers[item].name, exchangers[item].meta)
    //     }
    //   })
    // })

    this.screen.on('resize', () => {
      utils.throttle(() => {
        this.init(this.cacheData)
      }, 360)()
    })

    this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0)
    })
  }

  washData(last, open) {
    const market = []

    last.map((lastPrice) => {
      open.map((openPrice) => {
        if (lastPrice.name === openPrice.name) {
          market.push({ name: lastPrice.name, last: lastPrice.last, open: openPrice.open })
        }
      })
    })

    return market.map((item) => {
      const change = (item.last - item.open).toString().charAt(0) === '-'
      ? `- ${utils.formatDecimal(-(item.last - item.open) / item.open * 100, 2)}%`
      : `+ ${utils.formatDecimal((item.last - item.open) / item.open * 100, 2)}%`

      return [item.name, item.last, change]
    })
  }

  createTable(data) {
    this.table.setData({
      headers: ['Asset Name', 'Price', 'Change'],
      data: data,
    })

    this.table.focus()
    this.screen.render()
  }

  createLine(name, data) {
    const series = {
      title: name,
      x: data.labels,
      y: data.closePrices,
    }

    this.line.setData(series)
    this.screen.render()
  }

  createLog(data) {
    this.log.log(data)
    this.screen.render()
  }

  updateLine(name = 'ETH', pair = 'eth_cny_yunbi', period = 1440) {
    const since = (parseInt(Date.now() / 1000, 10) - parseInt(period, 10) * 60 * 60)

    this.fetchLine(pair, period, since).then((data) => {
      const lineData = this.washLineData(data, period)
      this.createLine(name, lineData)
      this.createLog(utils.formatCurrentTime())
    }, (e) => {
      this.createLog(e)
    })
  }

  washLineData(data, period) {
    const closePrices = []
    const labels = []

    let fmt = 'hh:mm'
    switch (period) {
      case 5:
      case 60:
        break
      case 120:
      case 240:
      case 1440:
        fmt = 'MM-dd'
        break
      case 10080:
        fmt = 'MM-dd'
        break
      default:
        break
    }

    data.map((record) => {
      const mappedRecord = {}
      const recordJSON = JSON.parse(record)
      mappedRecord.close = parseFloat(recordJSON.close)

      labels.push(utils.formatDate(new Date(recordJSON.timestamp * 1000), fmt))
      closePrices.push(mappedRecord.close)
    })

    return { closePrices, labels }
  }

  fetchLine(pair, period, since) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    this.createLog('fetching line...')

    return new Promise((resolve, reject) => {
      request
        .get('https://market.token.im/api/kline')
        .query({ pair, period, since })
        .end((err, res) => {
          if (!err) {
            resolve(res.body)
          } else {
            reject(err)
          }
        })
    })
  }
}

module.exports = Whale
