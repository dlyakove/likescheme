[![NPM version][npm-image]][npm-url]

## Description
likescheme is a plain Javascript implementation of the functional prefix-notation Scheme-like interpreted language.

Use it to dynamically evaluate external functional logic passed to the program at the run time, e.g. via input or configuration parameters.

## Installation

```bash
npm i likescheme
```

## Usage

### import

```javascript
// ECMAScript Module
import {evaluate} from 'likescheme';

// CommonJS Module
const likescheme = require('likescheme');
const evaluate = likescheme.evaluate;
```

### evaluate

```javascript
evaluate (
    code, // string, e.g. [gt [get amount] 100.0]
          // or Array, e.g. ['gt', ['get', 'amount']],
          // or JSON, e.g. {operator: 'gt', args: [{operator: 'get', args: ['amount']}, 100.0]}
    data, // object, JSON, optional, e.g. {price: 150.0}, nested objects and lists are supported (see examples)
    strict // boolean, optional, default=true, if true, unknown variable throws error, else they are set to undefined
)
```

### Examples:
- [example.cjs](https://github.com/dlyakove/likescheme/blob/main/example.cjs)
- [example.mjs](https://github.com/dlyakove/likescheme/blob/main/example.mjs)
- [example-npm.cjs](https://github.com/dlyakove/likescheme/blob/main/example-npm.cjs)
- [example-npm.mjs](https://github.com/dlyakove/likescheme/blob/main/example-npm.mjs)

[npm-url]: https://www.npmjs.com/package/likescheme
[npm-image]: https://img.shields.io/npm/v/likescheme.svg
