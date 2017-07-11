#!/usr/bin/env node

const fs = require('fs');
const CFonts = require('cfonts')
const args = require('../libs/args')
const prompt = require('../libs/prompt')
const Whale = require('../index')

let exchangers = require('../config/exchangers.json');
if (args.config) {
  if (!fs.existsSync(args.config)) {
    return console.error(`config file ${args.config} does not exist`);
  }
  exchangers = require(args.config);
}

prompt(exchangers).then((answer) => {
  CFonts.say('Whale, show Ethereum and Bitcoin price in command line interface (CLI).|Loading...', {
    font: 'console',
    align: 'left',
    colors: ['candy'],
    letterSpacing: 1,
    lineHeight: 1.8,
    space: true,
    maxLength: '0'
  })

  const exchange = exchangers[answer.exchange];
  exchange.name = answer.exchange;
  new Whale(args.seconds, exchange, answer.markets)
}).catch(console.log)
