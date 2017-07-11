const blessed = require('blessed')
const contrib = require('blessed-contrib')
const api = require('./libs/api')
const utils = require('./libs/utils')
const wash = require('./libs/wash')

class Whale {
  constructor(config, exchange, markets) {
    this.config = config;
    this.cacheData = {}

    this.fetchPrice(exchange, markets).then((data) => {
      this.screen = blessed.screen()
      this.grid = new contrib.grid({ rows: 12, cols: 12, screen: this.screen })
      this.cacheData = data

      this.initDashBoard(data, exchange)
      this.eventListeners(config.interval, exchange, markets)
    }).catch((err) => {
      console.error('fetchPrice', err)
      process.exit(1)
    })
  }

  fetchPrice(exchange, markets) {
    const currentMarket = markets[0]

    return new Promise((resolve, reject) => {
      Promise.all([
        api.getCurrentPrice(exchange, markets),
        api.getPriceTrend(exchange, currentMarket),
      ]).then((res) => {
        resolve({
          currentPrice: wash.currentPrice(exchange, res[0]),
          priceTrend: res[1],
        })
      }).catch((err) => {
        reject(err)
      })
    })
  }

  initDashBoard(data, exchange) {
    this.table = this.grid.set(0, 0, 6, 12, contrib.table,
      { keys: true
      , vi: true
      , fg: this.config.colors.tableFg
      , selectedFg: this.config.colors.tableSelectedFg
      , selectedBg: this.config.colors.tableSelectedBg
      , interactive: true
      , label: `${exchange.name} -- Current Price`
      , border: { type: "line", fg: this.config.colors.border }
      , columnSpacing: 10
      , columnWidth: [10, 10, 10] })

    this.line = this.grid.set(6, 0, 5, 12, contrib.line,
      { label: 'Price Trend (recent month)'
      , showLegend: this.config.showLegend })

    this.log = this.grid.set(11, 0, 1, 12, contrib.log,
      { fg: this.config.logFg
      , selectedFg: this.config.logSelectedFg
      , label: 'Server Log' })

    this.createTable(data.currentPrice)
    this.createLine(data.priceTrend)
    this.createLog(utils.formatCurrentTime())

    this.table.rows.on('select', (item, selectedIndex) => {
      this.updatePriceTrend(exchange, this.cacheData.currentPrice[selectedIndex][0])
    })
  }

  eventListeners(interval, exchange, markets) {
    this.timer = setInterval(() => {
      this.createLog('Loading...')
      api.getCurrentPrice(exchange, markets).then((res) => {
        this.createTable(wash.currentPrice(exchange, res))
        this.createLog(utils.formatCurrentTime())
      }).catch((err) => {
        console.error(`\n Load failure: ${err}`)
        process.exit(1)
      })
    }, 1000 * (Number.isInteger(interval) ? interval : 180))

    this.screen.on('resize', () => {
      utils.throttle(() => {
        this.initDashBoard(this.cacheData, exchange)
      }, 360)()
    })

    this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      this.timer && clearInterval(this.timer)
      return process.exit(0)
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

  createLine(data) {
    const series = {
      title: data.currentMarket,
      x: data.labels,
      y: data.closePricesList,
    }

    this.line.setData(series)
    this.screen.render()
  }

  createLog(data) {
    this.log.log(data)
    this.screen.render()
  }

  updatePriceTrend(exchange, selectedMarket) {
    this.createLog(`Loading ${selectedMarket} data...`)
    api.getPriceTrend(exchange, selectedMarket).then((data) => {
      this.createLine(data)
      this.createLog(utils.formatCurrentTime())
    }).catch((err) => {
      console.error('updatePriceTrend', err)
      process.exit(1)
    })
  }
}

module.exports = Whale
