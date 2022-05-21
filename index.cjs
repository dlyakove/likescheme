'use strict';

const interpreter = require('./interpreter.cjs');
//import {parse, translate, compile, interpret, interpretJson} from './interpreter.js';

function add(a, b) {
  return a + b;
}

module.exports = {
  add,
  parse: interpreter.parse,
  compile: interpreter.compile,
  interpretText: interpreter.interpretText,
  evaluate: interpreter.evaluate,
};