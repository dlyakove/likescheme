[![NPM version][npm-image]][npm-url]

## Description
likescheme is a plain Javascript implementation of the functional prefix-notation Scheme-like interpreted language. It evaluates functional logic statements represented as a string or an object in a provided execution environment scope. 
Syntaxically, likescheme is somewhat similar to Tcl language.

### Use Case

#### Move logic from code to configuration.
__likescheme__ lets you encode functional statements directly into the configuration layer of your app or service when coding it in Javascript is not feasible due to complexity or security considerations.

#### Examples:
- UI elements visibility logic
- workflow routing rules
- data or ETL mapping logic

### Why not Lisp or Scheme or Lua?
The following popular plain Javascript implementation of Lisp, Scheme or Lua could be considered an alternative.
- [LIPS](https://lips.js.org/)
- [Lua](https://www.npmjs.com/package/lua-interpreter)

However, we decided to create __likescheme__ to limit functionality to conditional and aggregate operations only, which reduces complexity, the learning curve, and makes it safer. 

## Installation

```bash
npm i likescheme
```

## Usage

### import

#### ECMAScript Module

```javascript
import {evaluate} from 'likescheme';
```

#### CommonJS Module

```javascript
const likescheme = require('likescheme');
const evaluate = likescheme.evaluate;
```

#### In-browser Use

```html
  ...
  <head>
    ...
    <script src="https://unpkg.com/likescheme/dist/index.browser.js"></script>
    ...
  </head>
  <body>
    ...
    <script>
      /* global likescheme */
      ...
      likescheme.evaluate("[eq '1', '1");
      ...
    </script>
  </body>
  ...
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
- `undefined|null|true|false`
  - takes no arguments, returns __undefined__, __null__, __true__, and __false__ respectively
- `isundefined key`
  - returns __true__ if the data object does not contain the property referenced by __key__; this function is not affected by the __strict__ argument value.
  - note: to test for the actual undefined value of an existing data object property, use `[eq [get 'myVar'] [undefined]]` 
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
- `days value1 value2`
    - returns the number of days between the two dates represented by __value1__ (from date) and __value2__ (thru date), exclusive of thru date
    - the date value is expected to be a string parseable by Javascript `Date.parse()`
    - if the date value cannot be parsed, the function returns `NaN`
    - `"[days '2022-06-01' '2022-06-17']"`
        - returns `16` 
    - `code: "[days [get 'fromDate'] [get 'endDate']]", data: {fromDate: '2022-06-17', endDate: '2022-06-01'}`
        - returns `-16` 
- `vdays key1 key2`
    - syntaxical sugar for `days`
    - returns the number of days between the two dates contained in the objects referenced by __key1__ and __key2__
    - `code: "[vdays 'fromDate' 'endDate']", data: {fromDate: '2022-06-01', endDate: '2022-06-17'}`
        - returns `16` 
- `today`
    - returns today's date in YYYY-MM-DD format
    - `"[days [today] [today]]"`
      - return `0`
- `join|split|uniq|usort|lindex|lrange`
    - for these list functions see [Examples](./examples) and [the actual code](./interpreter.cjs)
- `sum|mult|div|neg|rem|sub`
    - for these aggregate functions see [Examples](./examples) and [the actual code](./interpreter.cjs)

[npm-url]: https://www.npmjs.com/package/likescheme
[npm-image]: https://img.shields.io/npm/v/likescheme.svg
