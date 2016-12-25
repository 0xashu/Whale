const blessed = require('blessed')
const contrib = require('blessed-contrib')
const Price = require('./libs/price')
const utils = require('./libs/utils')
const exchangers = require('./config/exchangers')

class Whale {
  constructor(args, pairs) {
    this.price = new Price()
    this.cacheData = []

    this.fetchPrice(pairs).then((data) => {
      this.screen = blessed.screen()
      this.grid = new contrib.grid({ rows: 12, cols: 12, screen: this.screen })
      this.cacheData = data

      this.init(data)
      this.eventListeners(args, pairs)
    }).catch((err) => {
      console.error(err)
    })
  }

  fetchPrice(pairs) {
    const currentPair = pairs.split(',')[0]

    return new Promise((resolve, reject) => {
      Promise.all([
        this.price.getCurrentPrice(pairs),
        this.price.getOpenPrice(pairs),
        this.price.getPriceTrend(currentPair),
      ]).then((res) => {
        resolve({
          currentPrice: this.washCurrentPrice(res[0], res[1]),
          priceTrend: this.washPriceTrend(currentPair, res[2]),
        })
      }).catch((err) => {
        reject(err)
      })
    })
  }

  init(data) {
    this.table = this.grid.set(0, 0, 6, 12, contrib.table,
      { keys: true
      , vi: true
      , fg: 'white'
      , selectedFg: 'white'
      , selectedBg: 'cyan'
      , interactive: true
      , label: 'Whale -- Current Price'
      , border: { type: "line", fg: "cyan" }
      , columnSpacing: 10
      , columnWidth: [10, 10, 10] })

    this.line = this.grid.set(6, 0, 5, 12, contrib.line,
      { label: 'Price Trend (recent month)'
      , showLegend: true })

    this.log = this.grid.set(11, 0, 1, 12, contrib.log,
      { fg: "green"
      , selectedFg: "green"
      , label: 'Server Log' })

    this.createTable(data.currentPrice)
    this.createLine(data.priceTrend)
    this.createLog(utils.formatCurrentTime())
  }

  eventListeners(args, pairs) {
    this.timer = setInterval(() => {
      this.createLog('Loading...')
      this.fetchPrice(pairs).then((data) => {
        this.cacheData = data

        this.createTable(data.currentPrice)
        this.createLog(utils.formatCurrentTime())
      }).catch((err) => {
        console.error(`Load failure: ${err}`)
      })
    }, 1000 * (Number.isInteger(args.seconds) ? args.seconds : 30))

    this.table.rows.on('select', (item, selectedIndex) => {
      this.updatePriceTrend(this.cacheData.currentPrice[selectedIndex][0])
    })

    this.screen.on('resize', () => {
      utils.throttle(() => {
        this.init(this.cacheData)
      }, 360)()
    })

    this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      this.timer && clearInterval(this.timer)
      return process.exit(0)
    })
  }

  washCurrentPrice(last, open) {
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

  washPriceTrend(currentPair, data) {
    const closePrices = []
    const labels = []

    data.map((record) => {
      closePrices.push(record[1])
      labels.push(utils.formatDate(new Date(record[0] * 1000), 'MM-dd'))
    })

    return {
      currentPair,
      closePrices,
      labels
    }
  }

  createTable(data) {
    this.table.setData({
      headers: ['Asset Name', 'Price', 'Change'],
      data: data,
    })

    this.table.focus()
    this.screen.render()
  }

  createLine(data) {
    const series = {
      title: data.currentPair,
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

  updatePriceTrend(selectedPair) {
    this.createLog(`Loading ${selectedPair} data...`)
    this.price.getPriceTrend(selectedPair).then((data) => {
      this.createLine(this.washPriceTrend(selectedPair, data))
      this.createLog(utils.formatCurrentTime())
    }).catch((err) => {
      console.error(err)
    })
  }
}

module.exports = Whale
