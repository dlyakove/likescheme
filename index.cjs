'use strict';

const interpreter = require('./interpreter.cjs');
//import {parse, translate, compile, interpret, interpretJson} from './interpreter.js';

function add(a, b) {
  return a + b;
}

module.exports = {
  add,
  parse: interpreter.parse,
  translate: interpreter.translate,
  compile: interpreter.compile,
  interpretText: interpreter.interpret,
  interpretJson: interpreter.interpretJson,
};