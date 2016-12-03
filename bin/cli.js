#!/usr/bin/env node

const args = require('../libs/args')
const prompt = require('../libs/prompt')
const Whale = require('../index')

prompt.then((answer) => {
  new Whale(args, answer.pairs.join(','))
})
