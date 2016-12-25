#!/usr/bin/env node

const CFonts = require('cfonts')
const args = require('../libs/args')
const prompt = require('../libs/prompt')
const Whale = require('../index')

prompt.then((answer) => {
  CFonts.say('WHALE, a Ethereum and Bitcoin price board for geeks|Loading...', {
    font: 'console',
    align: 'left',
    colors: ['candy'],
    letterSpacing: 1,
    lineHeight: 1.8,
    space: true,
    maxLength: '0'
  })

  new Whale(args, answer.exchange, answer.markets)
})
