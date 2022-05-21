/* global expect */
const index = require('./index');
//import {parse, translate, compile, interpret, interpretJson} from './interpreter.js';

// extend expect handler to customize the message
expect.extend({
  toBeEqual(received, expected, custom) {
    let pass = true;
    let message = '';
    try {
      expect(received).toEqual(expected);
    } catch (e) {
      pass = false;
      message = `expected '${expected}' received '${
        (typeof received === 'object' && received !== null) ? JSON.stringify(received, null, 0) : received
      }'`;
    }
    return {
      pass,
      message: () => message,
      expected,
      received
    };
  }
});

const scenarios = [
  {
    group: 'parse',
    fn: (({code}) => index.parse(code)),
    tests: [
      {name: 100, args: {code: "[eq '1' '1']"}, result: ['eq', '1', '1']},
      {
        name: 202, args: {code: "[map [var 'product.name'] [list 'apple' 'fruit' 'banana' 'fruit' 'tomato' 'vegetable'] 'unknown']"},
        result: ['map', ['var', 'product.name'], ['list', 'apple', 'fruit', 'banana', 'fruit', 'tomato', 'vegetable'], 'unknown']
      }, 
    ]
  },  
  {
    group: 'compile',
    fn: (({code}) => index.compile(code)),
    tests: [
      {name: 100, args: {code: "['eq' '1' '1']"}, result: {operator: 'eq', args: ['1', '1']}},
      {
        name: 202, args: {code: "[map [var 'product.name'] [list 'apple' 'fruit' 'banana' 'fruit' 'tomato' 'vegetable'] 'unknown']"},
        result: {operator: 'map', 'args': [{operator: 'var','args':['product.name']}, {operator: 'list', args: ['apple', 'fruit', 'banana', 'fruit', 'tomato', 'vegetable']}, 'unknown']}
      },
      {name: 214, args: {code: "[sum [var 'order.items.amount']]"}, result: {operator: 'sum', args: [{operator: 'var', args: ['order.items.amount']}]}},
    ]
  },  
  {
    group: 'evaluate text',
    fn: (({code, data}) => index.evaluate(code, data)),
    //fn: (({code, data}) => index.interpretText(code, data)),
    tests: [
      {name: 100, args: {code: "[eq '1' '1']", data: {}}, result: true},
      {name: 102, args: {code: "[not [eq '1' '1']]", data: {}}, result: false},
      {name: 110, args: {code: "[veq 'product' 'apple']", data: {product: 'apple'}}, result: true},
      {name: 112, args: {code: "[veq 'product.name' 'apple']", data: {product: {name: 'apple'}}}, result: true},
      {name: 120, args: {code: "[isy 'isRound']", data: {isRound: 'y'}}, result: true},
      {name: 130, args: {code: "[and [isy 'isRound'] [isy 'isRed']]", data: {isRound: 'y', isRed: 'n'}}, result: false},
      {name: 132, args: {code: "[or [isy 'isRound'] [isy 'isRed']]", data: {isRound: 'y', isRed: 'n'}}, result: true},
      {name: 140, args: {code: "[vin 'product.category' [list 'fruit' 'vegetable' 'grain']]", data: {product: {category: 'fruit'}}}, result: true},
      {name: 142, args: {code: "[vin 'product.category' [list 'fruit' 'vegetable' 'grain']]", data: {product: {category: 'coffee'}}}, result: false},
      {name: 150, args: {code: "[vge 'product.price' 10.0]", data: {product: {price: 15.0}}}, result: true},
      {name: 152, args: {code: "[vge 'product.price' 10.0]", data: {product: {price: 5.0}}}, result: false},
      {name: 160, args: {code: "[bw [var 'product.price'] 5.0 15.0]", data: {product: {price: 10.0}}}, result: true},
      {name: 162, args: {code: "[bw [var 'product.price'] 5.0 15.0]", data: {product: {price: 20.0}}}, result: false},
      {name: 170, args: {code: "[min [list 1 10 11 101]]", data: {}}, result: 1},
      {name: 172, args: {code: "[max [list 1 10 11 101]]", data: {}}, result: 101},
      {name: 174, args: {code: "[max [list '1' '10' '11' '101']]", data: {}}, result: '11'},
      {name: 200, args: {code: "[map [var 'product.name'] [list 'apple' 'fruit' 'banana' 'fruit' 'tomato' 'vegetable'] 'unknown']", data: {product: {name: 'apple'}}}, result: 'fruit'},
      {name: 202, args: {code: "[map [var 'product.name'] [list 'apple' 'fruit' 'banana' 'fruit' 'tomato' 'vegetable'] 'unknown']", data: {product: {name: 'kiwi'}}}, result: 'unknown'},
      {name: 210, args: {code: "[join [var 'fruits'] ',']", data: {fruits: ['apple', 'banana', 'kiwi']}}, result: 'apple,banana,kiwi'},
      {name: 212, args: {code: "[split [var 'fruits'] ',']", data: {fruits: 'apple,banana,kiwi'}}, result: ['apple', 'banana', 'kiwi']},
      {name: 214, args: {code: "[sum [var 'order.items.amount']]", data: {order: {items: [{amount: 100.0}, {amount: 200.0}, {amount: 300.0}]}}}, result: 600},
    ]
  },  
  {
    group: 'evaluate JSON',
    fn: (({code, data}) => index.evaluate(code, data)),
    tests: [
      {name: 100, args: { code: { operator: 'eq', args: [ '1', '1' ] } , data: {}}, result: true},
      {name: 102, args: { code: { operator: 'not', args: [{ operator: 'eq', args: ['1', '1']}]} , data: {}}, result: false},
      {name: 110, args: { code: { operator: 'veq', args: [ 'product', 'apple' ] } , data: {product: 'apple'}}, result: true},
      {name: 112, args: { code: { operator: 'veq', args: [ 'product.name', 'apple' ] } , data: {product: {name: 'apple'}}}, result: true},
      {name: 120, args: { code: { operator: 'isy', args: [ 'isRound' ] } , data: {isRound: 'y'}}, result: true},
      {name: 130, args: { code: { operator: 'not', args: [{ operator: 'eq', args: ['1', '1']}]} , data: {isRound: 'y', isRed: 'n'}}, result: false},
      {name: 132, args: { code: { operator: 'or', args: [{ operator: 'isy', args: ['isRound']},{ operator: 'isy', args: ['isRed']}]} , data: {isRound: 'y', isRed: 'n'}}, result: true},
      {name: 140, args: { code: { operator: 'vin', args: ['product.category',{ operator: 'list', args: ['fruit', 'vegetable', 'grain']}]} , data: {product: {category: 'fruit'}}}, result: true},
      {name: 142, args: { code: { operator: 'vin', args: ['product.category',{ operator: 'list', args: ['fruit', 'vegetable', 'grain']}]} , data: {product: {category: 'coffee'}}}, result: false},
      {name: 150, args: { code: { operator: 'vge', args: [ 'product.price', 10 ] } , data: {product: {price: 15.0}}}, result: true},
      {name: 152, args: { code: { operator: 'vge', args: [ 'product.price', 10 ] } , data: {product: {price: 5.0}}}, result: false},
      {name: 160, args: { code: { operator: 'bw', args: [{ operator: 'var', args: ['product.price']},5,15]} , data: {product: {price: 10.0}}}, result: true},
      {name: 162, args: { code: { operator: 'bw', args: [{ operator: 'var', args: ['product.price']},5,15]} , data: {product: {price: 20.0}}}, result: false},
      {name: 170, args: { code: { operator: 'min', args: [{ operator: 'list', args: [1,10,11,101]}]} , data: {}}, result: 1},
      {name: 172, args: { code: { operator: 'max', args: [{ operator: 'list', args: [1,10,11,101]}]} , data: {}}, result: 101},
      {name: 174, args: { code: { operator: 'max', args: [{ operator: 'list', args: ['1', '10', '11', '101']}]} , data: {}}, result: '11'},
      {name: 200, args: { code: { operator: 'map', args: [{ operator: 'var', args: ['product.name']},{ operator: 'list', args: ['apple', 'fruit', 'banana', 'fruit', 'tomato', 'vegetable']},'unknown']} , data: {product: {name: 'apple'}}}, result: 'fruit'},
      {name: 202, args: { code: { operator: 'map', args: [{ operator: 'var', args: ['product.name']},{ operator: 'list', args: ['apple', 'fruit', 'banana', 'fruit', 'tomato', 'vegetable']},'unknown']} , data: {product: {name: 'kiwi'}}}, result: 'unknown'},
      {name: 210, args: { code: { operator: 'join', args: [{ operator: 'var', args: ['fruits']}, ',']} , data: {fruits: ['apple', 'banana', 'kiwi']}}, result: 'apple,banana,kiwi'},
      {name: 212, args: { code: { operator: 'split', args: [{ operator: 'var', args: ['fruits']}, ',']} , data: {fruits: 'apple,banana,kiwi'}}, result: ['apple', 'banana', 'kiwi']},
      {name: 214, args: { code: { operator: 'sum', args: [{ operator: 'var', args: ['order.items.amount']}]} , data: {order: {items: [{amount: 100.0}, {amount: 200.0}, {amount: 300.0}]}}}, result: 600},
    ]
  },  
];

describe.each(scenarios)(
  "Test Group '$group'",
  (({group, fn, tests}) => {
    test.each(tests)(
      'Scenario $name ($#)',
      ({name, args, result}) => {
        try {
          expect(fn(args)).toBeEqual(result, `${name}`);
        } catch(error) {
          error.stack = undefined;
          throw error;
        }
    });
  })
);