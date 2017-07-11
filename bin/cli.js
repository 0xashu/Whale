#!/usr/bin/env node

const fs = require('fs');
const CFonts = require('cfonts')
const args = require('../libs/args')
const prompt = require('../libs/prompt')
const Whale = require('../index')

let exchangers = require('../config/exchangers.json');
let config     = require('../config/whale.json');

// deepMerge to use built-in config as defaults.
const deepMerge = function (target, source) {
  for (var p in source) {
    if (!target.hasOwnProperty(p)) { // set
      target[p] = source[p];
    } else if (target[p] instanceof Object) { // recurse
      deepMerge(target[p], source[p])
    }
  }
  return target;
}

if (args.config) {
  if (!fs.existsSync(args.config)) {
    return console.error(`config file ${args.config} does not exist`);
  }
  // Detect combined config.
  let _config = require(args.config);
  if (_config.hasOwnProperty('exchangers')) {
    exchangers = _config.exchangers;
  }
  if (_config.hasOwnProperty('whale')) {
    config = deepMerge(_config.whale, config);
  }
}

prompt(exchangers, args.all).then((answer) => {
  CFonts.say('Whale, show Ethereum and Bitcoin price in command line interface (CLI).|Loading...', {
    font: 'console',
    align: 'left',
    colors: ['candy'],
    letterSpacing: 1,
    lineHeight: 1.8,
    space: true,
    maxLength: '0'
  })

  // Init whale with selected exchange.
  const exchange = exchangers[answer.exchange];
  exchange.name = answer.exchange;

  new Whale(config, exchange, answer.markets)
}).catch(console.error)
