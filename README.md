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

### Examples

```javascript
evaluate(
    "[and [veq 'order.product' 'apple'] [vge 'order.quantity 1]]",
    {
        order: {
            product: 'apple',
            quantity: 1
        }
    }
);
```

#### More Examples
- [example.cjs](https://github.com/dlyakove/likescheme/blob/main/example.cjs)
- [example.mjs](https://github.com/dlyakove/likescheme/blob/main/example.mjs)
- [example-npm.cjs](https://github.com/dlyakove/likescheme/blob/main/example-npm.cjs)
- [example-npm.mjs](https://github.com/dlyakove/likescheme/blob/main/example-npm.mjs)

## Functions
- `get key`
  - returns the value of the data object property referenced by `key`. Nested objects supported via 'dot' notation.
  - example: `{operator: 'get', args: ['product.name']}`
- `list 'value1' ... `
  - returns the list (array) of values
  - example: `{operator: 'list', args: ['apple', 'banana', 'pear']}`
- `in value list`
  - returns True if the `value` is in the list provided in the second argument
  - example: `{operator: 'in', args: [{operator: 'get', args:['product.name']}, {operator: list, args: ['apple', 'banana', 'pear']}]`
- `eq|lt|gt|le|ge value1 value2`
  - returns True if `value1` is equal|less-then|greater-then|less-or-equal-then|greater-or-equal-then to `value2`
  - example: `{operator: 'eq', args: [{operator: 'get', args: ['product.name']}, 'apple']}`
- `isy|isn|isu key`
  - syntaxical sugar - returns True if the value of the data object property referenced by `key` is 'truthy', 'falsy' or unknown respectively
  - example: `{operator: 'isy', args: ['isAdult']}`:
    - returns True if the case-insensitive answer to the question with the key `isAdult` is one of: 'true', '1', 'yes', 'y'
- `not value`
  - returns the boolean 'not' of its argument
  - example: `{operator: 'not', args: [{operator: 'in', {operator: 'get', args: ['product.name']}, {operator: list, args: ['apple', 'banana', 'pear']}]}`
- `and|or value1, ...`
  - returns the boolean 'and|or' of its arguments
  - example: `{operator: 'and', args: [{operator: 'isy', args: ['isInsured']}, {operator: 'isy', args: ['hasEob']}}`

## TODO
- [ ] proof-read README
- [ ] minimize code
- [ ] scan against Javascript injection

[npm-url]: https://www.npmjs.com/package/likescheme
[npm-image]: https://img.shields.io/npm/v/likescheme.svg
