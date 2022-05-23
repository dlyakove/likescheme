[![NPM version][npm-image]][npm-url]

## Description
likescheme is a plain Javascript implementation of the functional prefix-notation Scheme-like interpreted language.

Evaluates functional logic represented as a string or an object in the scope of the provided execution environment. 

### Use Cases

Use it with a user or a 3rd-party managed UI configuration or ETL mapping rules like the following and when letting the user or the 3rd party code the logic directly in Javascript is not feasible due to complexity or security considerations.
- UI elements visibility logic
- workflow routing rules
- data mapping logic

### Why not Lisp or Scheme or Lua
The following popular plain Javascript implementation of Lisp, Scheme or Lua could be considered as an alternative.
We thought of rolling our own functional language to reduce the complexity, the learning curve, and to limit available functionality to the conditional and aggregate operations only.
- [LIPS](https://lips.js.org/)
- [Lua](https://www.npmjs.com/package/lua-interpreter)

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

Evaluates __code__ in the context of the provided __data__ object.

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

// returns
true
```

#### More Examples
- See more examples [here](./examples)

### parse

Converts __code__ from __string__ to __Array__ (list) representation.

```javascript
parse(code)
```
### Examples

```javascript
import {parse} from 'likescheme';

parse("[and [veq 'order.product' 'apple'] [vge 'order.quantity' 1]]");

// returns
['and', [ 'veq', 'order.product', 'apple' ], [ 'vge', 'order.quantity', 1]]
```

### compile

Converts __code__ from __Array__ to __JSON__ representation.

```javascript
compile( ['and', [ 'veq', 'order.product', 'apple' ], [ 'vge', 'order.quantity', 1]]);

// returns
{
  operator: 'and',
  args: [
    { operator: 'veq', args: [ 'order.product', 'apple' ] },
    { operator: 'vge', args: [ 'order.quantity', 1 ] }
  ]
}
```

## Functions
- `get key`
  - returns the value of the data object property referenced by __key__. Nested objects supported via 'dot' notation.
      - `"[get 'product.name']"`
      - `['get', 'product.name']`
      - `{operator: 'get', args: ['product.name']}`
- `list 'value1' ... `
  - returns the list (array) of values
      - `"[list 'apple' 'banana' 'pear']"`
      - `['list', 'apple', 'banana', 'pear' ]`
      - `{operator: 'list', args: ['apple', 'banana', 'pear']}`
- `in value list`
  - returns __true__ if the __value__ is in the list provided in the second argument
      - `"[in [get 'product.name'] [list 'apple' 'banana' 'pear']]"`
      - `['in', ['get', 'product.name'], ['list', 'apple', 'banana', 'pear']]`
      - `{operator: 'in', args: [{operator: 'get', args:['product.name']}, {operator: 'list', args: ['apple', 'banana', 'pear']}]}`
- `eq|ne|lt|gt|le|ge value1 value2`
  - returns __true__ if __value1__ is equal|not-equal|less-then|greater-then|less-or-equal-then|greater-or-equal-then to __value2__
      - `"[eq [get 'product.name'] 'apple']"`
      - `['eq', ['get', 'product.name'], 'apple']`
      - `{operator: 'eq', args: [{operator: 'get', args: ['product.name']}, 'apple']}`
  - example: `{operator: 'eq', args: [{operator: 'get', args: ['product.name']}, 'apple']}`
- `isy|isn|isu key`
  - syntaxical sugar - returns __true__ if the value of the data object property referenced by __key__ is 'truthy', 'falsy' or unknown respectively
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
  - syntaxical sugar - returns __true__ if the value of the data object property referenced by __key__ is equal|not-equal|less-then|greater-then|less-or-equal-then|greater-or-equal-then to __value__
      - `"[veq 'product.name' 'apple']"`
      - `['veq', 'product.name', 'apple']`
      - `{operator: 'veq', args: [ 'product.name', 'apple' ]}`
- `vin key list`
  - syntaxical sugar - returns __true__ if the value of the data object propert referenced by __key__ is in the list provided in the second argument
      - `"[vin 'product.name' [list 'apple' 'banana' 'pear']]"`
      - `['vin', 'product.name', ['list', 'apple', 'banana', 'pear']]`
      - `{operator: 'vin', args: ['product.name', {operator: 'list', args: ['apple', 'banana', 'pear']}]}`
- `bw value fromValue thruValue`
    - returns __true__ if __value__ is between __fromValue__ and __thruValue__, inclusive on both ends
      - `"[bw [get 'product.price'] 5.0 15.0]"`
- `min|max list`
    - returns min|max value in the __list__
      - `"[min [list 1 10 11 101]]"`
- `map value (key1, value1, ... keyX, valueX) defaultValue`
    - returns __valueX__, which corresponds to the __keyX__, which is equal to __value__ or __defaultValue__ if such __keyX__ does not exist
    - `"[map [get 'product.name'] [list 'apple' 'fruit' 'banana' 'fruit' 'tomato' 'vegetable'] 'unknown']"`
        - returns `fruit` if `product.name` is `apple`
- `join|split|uniq|usort|sum`
    - for these and other functions see [Examples](./examples) and [the actual code](./interpreter.cjs)

## TODO
- [ ] proof-read README
- [ ] publish as webpack
- [ ] scan against Javascript injection

[npm-url]: https://www.npmjs.com/package/likescheme
[npm-image]: https://img.shields.io/npm/v/likescheme.svg
