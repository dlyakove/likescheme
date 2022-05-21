'use strict';

const interpreter = require('./interpreter.cjs');

module.exports = {
  parse: interpreter._parse,
  compile: interpreter._compile,
  evaluate: interpreter._evaluate,
};