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
- See more examples [here](./examples)

## Functions
- `get key`
  - returns the value of the data object property referenced by `key`. Nested objects supported via 'dot' notation.
      - `"[get 'product.name']"`
      - `['get', 'product.name']`
      - `{operator: 'get', args: ['product.name']}`
- `list 'value1' ... `
  - returns the list (array) of values
      - `"[list 'apple' 'banana' 'pear']"`
      - `['list', 'apple', 'banana', 'pear' ]`
      - `{operator: 'list', args: ['apple', 'banana', 'pear']}`
- `in value list`
  - returns `true` if the `value` is in the list provided in the second argument
      - `"[in [get 'product.name'] [list 'apple' 'banana' 'pear']]"`
      - `['in', ['get', 'product.name'], ['list', 'apple', 'banana', 'pear']]`
      - `{operator: 'in', args: [{operator: 'get', args:['product.name']}, {operator: 'list', args: ['apple', 'banana', 'pear']}]}`
- `eq|ne|lt|gt|le|ge value1 value2`
  - returns `true` if `value1` is equal|not-equal|less-then|greater-then|less-or-equal-then|greater-or-equal-then to `value2`
      - `"[eq [get 'product.name'] 'apple']"`
      - `['eq', ['get', 'product.name'], 'apple']`
      - `{operator: 'eq', args: [{operator: 'get', args: ['product.name']}, 'apple']}`
  - example: `{operator: 'eq', args: [{operator: 'get', args: ['product.name']}, 'apple']}`
- `isy|isn|isu key`
  - syntaxical sugar - returns `true` if the value of the data object property referenced by `key` is 'truthy', 'falsy' or unknown respectively
      - `"[isy 'isTaxFree']"`
      - `['isy', 'isTaxFree']`
      - `{operator: 'isy', args: [ 'isTaxFree' ]}`
- `not value`
  - returns the boolean 'not' of its argument
      - `"[not [in [get 'product.name'] [list 'apple' 'banana' 'pear']]]"`
      - `['not', ['in', ['get', 'product.name'], ['list', 'apple', 'banana', 'pear']]]`
      - `{operator: 'not', args: [{operator: 'in', args: [{operator: 'get', args: ['product.name']}, {operator: 'list', args: ['apple', 'banana', 'pear']}]}]}`
- `and|or value1, ...`
  - returns the boolean 'and|or' of its arguments
      - `"[and [isy 'isRound'] [isy 'isRed']]"`
      - `['and', ['isy', 'isRound'], ['isy', 'isRed']]`
      - `{operator: 'and', args: [{operator: 'isy', args: [Array]}, {operator: 'isy', args: [Array]}]}`
- `veq|vne|vlt|vgt|vle|vge key value`
  - syntaxical sugar - returns `true` if the value of the data object property referenced by `key` is equal|not-equal|less-then|greater-then|less-or-equal-then|greater-or-equal-then to `value`
      - `"[veq 'product.name' 'apple']"`
      - `['veq', 'product.name', 'apple']`
      - `{operator: 'veq', args: [ 'product.name', 'apple' ]}`
- `vin key list`
  - syntaxical sugar - returns `true` if the value of the data object propert referenced by `key` is in the list provided in the second argument
      - `"[vin 'product.name' [list 'apple' 'banana' 'pear']]"`
      - `['vin', 'product.name', ['list', 'apple', 'banana', 'pear']]`
      - `{operator: 'vin', args: ['product.name', {operator: 'list', args: ['apple', 'banana', 'pear']}]}`
- `bw value fromValue thruValue`
    - returns `true` if `value` is between `fromValue` and `thruValue`, inclusive on both ends
      - `"[bw [get 'product.price'] 5.0 15.0]"`
- `min|max list`
    - returns min|max value in the `list`
      - `"[min [list 1 10 11 101]]"`
- `map value (key1, value1, ... keyX, valueX) defaultValue`
    - returns `valueX`, which corresponds to the `keyX`, which is equal to `value` or `defaultValue` if such `keyX` does not exist
    - `"[map [get 'product.name'] [list 'apple' 'fruit' 'banana' 'fruit' 'tomato' 'vegetable'] 'unknown']"`
        - returns `fruit` if `product.name` is `apple`
- `join|split|uniq|usort|sum`
    - for these and other functions see [Examples](./examples) and [the actual code](./interpreter.cjs)

## TODO
- [ ] proof-read README
- [ ] minimize code
- [ ] scan against Javascript injection

[npm-url]: https://www.npmjs.com/package/likescheme
[npm-image]: https://img.shields.io/npm/v/likescheme.svg
