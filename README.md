[![NPM version][npm-image]][npm-url]

## Description
likescheme is a plain Javascript implementation of the functional prefix-notation Scheme-like interpreted language.

Use it to dynamically evaluate external functional logic passed to the program at the run time, e.g. via input or configuration parameters.

## Installation

```bash
npm i likescheme
```

## Usage

### Import

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
    code, // string, e.g. [gt [var amount] 100.0] or JSON, e.g. {operator: 'gt', args: [{operator: 'var', args: ['amount']}, 100.0]}
    data  // JSON, e.g. {amount: 150.0}
)
```

### Examples:
```javascript
import {evaluate} from 'likescheme';

// evaluate text-based code
console.log(
    evaluate(
        "[and [isy 'isRound'] [isy 'isRed']]",
        {isRound: 'y', isRed: 'n'}
    );
);

// evaluating JSON-based code
console.log(
    evaluate(
        {
            operator: 'or', args: [
                { operator: 'isy', args: ['isRound']},
                { operator: 'isy', args: ['isRed']}
            ]
        },
        { isRound: 'y', isRed: 'n'}
    );
);
```

[npm-url]: https://www.npmjs.com/package/likescheme