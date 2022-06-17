/* global expect */
const index = require('./dist/index.js');
/*
const interpreter = require('./src/interpreter.js'); // use only for testing
const index = {
  parse: interpreter._parse,
  compile: interpreter._compile,
  evaluate: interpreter._evaluate,
};
*/

// extend expect handler to customize the message
expect.extend({
  toBeEqual(received, expected, custom) {
    let pass = true;
    let message = '';
    try {
      expect(received).toEqual(expected);
    } catch (e) {
      pass = (expected === '__error') ? true : false;
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
      {name: 100, args: {code: "[eq '1' '1']"}, expected: ['eq', '1', '1']},
      {
        name: 202, args: {code: "[map [get 'product.name'] [list 'apple' 'fruit' 'banana' 'fruit' 'tomato' 'vegetable'] 'unknown']"},
        expected: ['map', ['get', 'product.name'], ['list', 'apple', 'fruit', 'banana', 'fruit', 'tomato', 'vegetable'], 'unknown']
      }, 
    ]
  },  
  {
    group: 'compile',
    fn: (({code}) => index.compile(code)),
    tests: [
      {name: 100, args: {code: ['eq', '1', '1']}, expected: {operator: 'eq', args: ['1', '1']}},
      {
        name: 202, args: {code: ['map', ['get', 'product.name'], ['list', 'apple', 'fruit', 'banana', 'fruit', 'tomato', 'vegetable'], 'unknown']},
        expected: {operator: 'map', 'args': [{operator: 'get','args':['product.name']}, {operator: 'list', args: ['apple', 'fruit', 'banana', 'fruit', 'tomato', 'vegetable']}, 'unknown']}
      },
      {name: 214, args: {code: ['sum', ['get', 'order.items.amount']]}, expected: {operator: 'sum', args: [{operator: 'get', args: ['order.items.amount']}]}},
    ]
  },  
  {
    group: 'evaluate text',
    fn: (({code, data, strict}) => index.evaluate(code, data, strict)),
    tests: [
      {name: 100, args: {code: "[get 'product.price']", data: {product: {price: 100.0}}}, expected: 100.0},
      {name: 102, args: {code: "[get 'product.price']", data: {}, strict: false}, expected: undefined},
      {name: 104, args: {code: "[get 'product.price']", data: {}}, expected: '__error'},
      {name: 200, args: {code: "[eq '1' '1']"}, expected: true},
      {name: 202, args: {code: "[not [eq '1' '1']]"}, expected: false},
      {name: 210, args: {code: "[veq 'product' 'apple']", data: {product: 'apple'}}, expected: true},
      {name: 212, args: {code: "[veq 'product.name' 'apple']", data: {product: {name: 'apple'}}}, expected: true},
      {name: 220, args: {code: "[isy 'isRound']", data: {isRound: 'y'}}, expected: true},
      {name: 230, args: {code: "[and [isy 'isRound'] [isy 'isRed']]", data: {isRound: 'y', isRed: 'n'}}, expected: false},
      {name: 232, args: {code: "[or [isy 'isRound'] [isy 'isRed']]", data: {isRound: 'y', isRed: 'n'}}, expected: true},
      {name: 240, args: {code: "[vin 'product.category' [list 'fruit' 'vegetable' 'grain']]", data: {product: {category: 'fruit'}}}, expected: true},
      {name: 242, args: {code: "[vin 'product.category' [list 'fruit' 'vegetable' 'grain']]", data: {product: {category: 'coffee'}}}, expected: false},
      {name: 250, args: {code: "[vge 'product.price' 10.0]", data: {product: {price: 15.0}}}, expected: true},
      {name: 252, args: {code: "[vge 'product.price' 10.0]", data: {product: {price: 5.0}}}, expected: false},
      {name: 260, args: {code: "[bw [get 'product.price'] 5.0 15.0]", data: {product: {price: 10.0}}}, expected: true},
      {name: 262, args: {code: "[bw [get 'product.price'] 5.0 15.0]", data: {product: {price: 20.0}}}, expected: false},
      {name: 270, args: {code: "[min [list 1 10 11 101]]", data: {}}, expected: 1},
      {name: 272, args: {code: "[max [list 1 10 11 101]]", data: {}}, expected: 101},
      {name: 274, args: {code: "[max [list '1' '10' '11' '101']]", data: {}}, expected: '11'},
      {name: 300, args: {code: "[map [get 'product.name'] [list 'apple' 'fruit' 'banana' 'fruit' 'tomato' 'vegetable'] 'unknown']", data: {product: {name: 'apple'}}}, expected: 'fruit'},
      {name: 302, args: {code: "[map [get 'product.name'] [list 'apple' 'fruit' 'banana' 'fruit' 'tomato' 'vegetable'] 'unknown']", data: {product: {name: 'kiwi'}}}, expected: 'unknown'},
      {name: 310, args: {code: "[join [get 'fruits'] ',']", data: {fruits: ['apple', 'banana', 'kiwi']}}, expected: 'apple,banana,kiwi'},
      {name: 312, args: {code: "[split [get 'fruits'] ',']", data: {fruits: 'apple,banana,kiwi'}}, expected: ['apple', 'banana', 'kiwi']},
      {name: 314, args: {code: "[sum [get 'order.items.amount']]", data: {order: {items: [{amount: 100.0}, {amount: 200.0}, {amount: 300.0}]}}}, expected: 600},
      {name: 316, args: {code: "[neg [get 'order.amount']]", data: {order: {amount: 100.0}}}, expected: -100.0},
      {name: 317, args: {code: "[neg [get 'order.items.amount']]", data: {order: {items: [{amount: 100.0}, {amount: 200.0}]}}}, expected: [-100.0, -200.0]},
      {name: 318, args: {code: "[inv [get 'order.amount']]", data: {order: {amount: 10.0}}}, expected: 0.1},
      {name: 320, args: {code: "[inv [get 'order.items.amount']]", data: {order: {items: [{amount: 10.0}, {amount: 20.0}]}}}, expected: [0.1, 0.05]},
      {name: 322, args: {code: "[mult [list 0.8 [get 'order.amount']]]", data: {order: {amount: 100.0}}}, expected: 80.0},
      {name: 324, args: {code: "[rem [get 'order.amount'] 5]", data: {order: {amount: 82.0}}}, expected: 2.0},
      {name: 326, args: {code: "[sub [get 'order.amount'] [get 'order.tax']]", data: {order: {amount: 82.5, tax: 2.5}}}, expected: 80.0},
      {name: 328, args: {code: "[div [get 'order.amount'] [get 'order.items']]", data: {order: {amount: 80.0, items: 4.0}}}, expected: 20.0},
      {name: 330, args: {code: "[days [get 'fromDate'] [get 'endDate']]", data: {fromDate: '2022-06-17', endDate: '2022-06-17'}}, expected: 0},
      {name: 331, args: {code: "[days '2022-06-01' '2022-06-17']", data: {}}, expected: 16},
      {name: 332, args: {code: "[days [get 'fromDate'] [get 'endDate']]", data: {fromDate: '2022-06-01', endDate: '2022-06-17'}}, expected: 16},
      {name: 334, args: {code: "[days [get 'fromDate'] [get 'endDate']]", data: {fromDate: '2022-06-17', endDate: '2022-06-01'}}, expected: -16},
      {name: 336, args: {code: "[days [get 'fromDate'] [get 'endDate']]", data: {fromDate: '', endDate: ''}}, expected: undefined},
      {name: 338, args: {code: "[days [get 'fromDate'] [get 'endDate']]", data: {fromDate: 'not-a-date', endDate: 'not-a-date'}}, expected: NaN},
      {name: 340, args: {code: "[vdays 'fromDate' 'endDate']", data: {fromDate: '2022-06-17', endDate: '2022-06-17'}}, expected: 0},
      {name: 342, args: {code: "[vdays 'fromDate' 'endDate']", data: {fromDate: '2022-06-01', endDate: '2022-06-17'}}, expected: 16},
      {name: 344, args: {code: "[vdays 'fromDate' 'endDate']", data: {fromDate: '2022-06-17', endDate: '2022-06-01'}}, expected: -16},
      {name: 346, args: {code: "[vdays 'fromDate' 'endDate']", data: {fromDate: '', endDate: ''}}, expected: undefined},
      {name: 348, args: {code: "[vdays 'fromDate' 'endDate']", data: {fromDate: 'not-a-date', endDate: 'not-a-date'}}, expected: NaN},
      {name: 350, args: {code: "[days [today] [today]]", data: {}}, expected: 0},
    ]
  },  
  {
    group: 'evaluate list',
    fn: (({code, data, strict}) => index.evaluate(code, data, strict)),
    tests: [
      {name: 100, args: {code: ['get', 'product.price'], data: {product: {price: 100.0}}}, expected: 100.0},
      {name: 102, args: {code: ['get', 'product.price'], data: {}, strict: false}, expected: undefined},
      {name: 104, args: {code: ['get', 'product.price'], data: {}}, expected: '__error'},
      {name: 200, args: {code: ['eq', '1', '1']}, expected: true},
      {name: 202, args: {code: ['not', ['eq', '1', '1']]}, expected: false},
      {name: 210, args: {code: ['veq', 'product', 'apple'], data: {product: 'apple'}}, expected: true},
      {name: 212, args: {code: ['veq', 'product.name', 'apple'], data: {product: {name: 'apple'}}}, expected: true},
      {name: 220, args: {code: ['isy', 'isRound'], data: {isRound: 'y'}}, expected: true},
      {name: 230, args: {code: ['and', ['isy', 'isRound'], ['isy', 'isRed']], data: {isRound: 'y', isRed: 'n'}}, expected: false},
      {name: 232, args: {code: ['or', ['isy', 'isRound'], ['isy', 'isRed']], data: {isRound: 'y', isRed: 'n'}}, expected: true},
      {name: 240, args: {code: ['vin', 'product.category', ['list', 'fruit', 'vegetable', 'grain']], data: {product: {category: 'fruit'}}}, expected: true},
      {name: 242, args: {code: ['vin', 'product.category', ['list', 'fruit', 'vegetable', 'grain']], data: {product: {category: 'coffee'}}}, expected: false},
      {name: 250, args: {code: ['vge', 'product.price', 10.0], data: {product: {price: 15.0}}}, expected: true},
      {name: 252, args: {code: ['vge', 'product.price', 10.0], data: {product: {price: 5.0}}}, expected: false},
      {name: 260, args: {code: ['bw', ['get', 'product.price'], 5.0, 15.0], data: {product: {price: 10.0}}}, expected: true},
      {name: 262, args: {code: ['bw', ['get', 'product.price'], 5.0, 15.0], data: {product: {price: 20.0}}}, expected: false},
      {name: 270, args: {code: ['min', ['list', 1, 10, 11, 101]], data: {}}, expected: 1},
      {name: 272, args: {code: ['max', ['list', 1, 10, 11, 101]], data: {}}, expected: 101},
      {name: 274, args: {code: ['max', ['list', '1', '10', '11', '101']], data: {}}, expected: '11'},
      {name: 300, args: {code: ['map', ['get', 'product.name'], ['list', 'apple', 'fruit', 'banana', 'fruit', 'tomato', 'vegetable'], 'unknown'], data: {product: {name: 'apple'}}}, expected: 'fruit'},
      {name: 302, args: {code: ['map', ['get', 'product.name'], ['list', 'apple', 'fruit', 'banana', 'fruit', 'tomato', 'vegetable'], 'unknown'], data: {product: {name: 'kiwi'}}}, expected: 'unknown'},
      {name: 310, args: {code: ['join', ['get', 'fruits'], ','], data: {fruits: ['apple', 'banana', 'kiwi']}}, expected: 'apple,banana,kiwi'},
      {name: 312, args: {code: ['split', ['get', 'fruits'], ','], data: {fruits: 'apple,banana,kiwi'}}, expected: ['apple', 'banana', 'kiwi']},
      {name: 314, args: {code: ['sum', ['get', 'order.items.amount']], data: {order: {items: [{amount: 100.0}, {amount: 200.0}, {amount: 300.0}]}}}, expected: 600},
      {name: 316, args: {code: ['neg', ['get', 'order.amount']], data: {order: {amount: 100.0}}}, expected: -100.0},
      {name: 317, args: {code: ['neg', ['get', 'order.items.amount']], data: {order: {items: [{amount: 100.0}, {amount: 200.0}]}}}, expected: [-100.0, -200.0]},
      {name: 318, args: {code: ['inv', ['get', 'order.amount']], data: {order: {amount: 10.0}}}, expected: 0.1},
      {name: 320, args: {code: ['inv', ['get', 'order.items.amount']], data: {order: {items: [{amount: 10.0}, {amount: 20.0}]}}}, expected: [0.1, 0.05]},
      {name: 322, args: {code: ['mult', ['list', 0.8, ['get', 'order.amount']]], data: {order: {amount: 100.0}}}, expected: 80.0},
      {name: 324, args: {code: ['rem', ['get', 'order.amount'], 5], data: {order: {amount: 82.0}}}, expected: 2.0},
      {name: 326, args: {code: ['sub', ['get', 'order.amount'], ['get', 'order.tax']], data: {order: {amount: 82.5, tax: 2.5}}}, expected: 80.0},
      {name: 328, args: {code: ['div', ['get', 'order.amount'], ['get', 'order.items']], data: {order: {amount: 80.0, items: 4.0}}}, expected: 20.0},      
      {name: 330, args: {code: ['days', ['get', 'fromDate'], ['get', 'endDate']], data: {fromDate: '2022-06-17', endDate: '2022-06-17'}}, expected: 0},
      {name: 331, args: {code: ['days', '2022-06-01', '2022-06-17'], data: {}}, expected: 16},
      {name: 332, args: {code: ['days', ['get', 'fromDate'], ['get', 'endDate']], data: {fromDate: '2022-06-01', endDate: '2022-06-17'}}, expected: 16},
      {name: 334, args: {code: ['days', ['get', 'fromDate'], ['get', 'endDate']], data: {fromDate: '2022-06-17', endDate: '2022-06-01'}}, expected: -16},
      {name: 336, args: {code: ['days', ['get', 'fromDate'], ['get', 'endDate']], data: {fromDate: '', endDate: ''}}, expected: undefined},
      {name: 338, args: {code: ['days', ['get', 'fromDate'], ['get', 'endDate']], data: {fromDate: 'not-a-date', endDate: 'not-a-date'}}, expected: NaN},
      {name: 340, args: {code: ['vdays', 'fromDate', 'endDate'], data: {fromDate: '2022-06-17', endDate: '2022-06-17'}}, expected: 0},
      {name: 342, args: {code: ['vdays', 'fromDate', 'endDate'], data: {fromDate: '2022-06-01', endDate: '2022-06-17'}}, expected: 16},
      {name: 344, args: {code: ['vdays', 'fromDate', 'endDate'], data: {fromDate: '2022-06-17', endDate: '2022-06-01'}}, expected: -16},
      {name: 346, args: {code: ['vdays', 'fromDate', 'endDate'], data: {fromDate: '', endDate: ''}}, expected: undefined},
      {name: 348, args: {code: ['vdays', 'fromDate', 'endDate'], data: {fromDate: 'not-a-date', endDate: 'not-a-date'}}, expected: NaN},
      {name: 350, args: {code: ['days', ['today'], ['today']], data: {}}, expected: 0},
    ]
  },   
  {
    group: 'evaluate JSON',
    fn: (({code, data, strict}) => index.evaluate(code, data, strict)),
    tests: [
      {name: 100, args: { code: { operator: 'get', args: [ 'product.price' ] }, data: {product: {price: 100.0}}}, expected: 100.0},
      {name: 102, args: { code: { operator: 'get', args: [ 'product.price' ] }, data: {}, strict: false}, expected: undefined},
      {name: 104, args: { code: { operator: 'get', args: [ 'product.price' ] }, data: {}}, expected: '__error'},
      {name: 200, args: { code: { operator: 'eq', args: [ '1', '1' ] }}, expected: true},
      {name: 202, args: { code: { operator: 'not', args: [{ operator: 'eq', args: ['1', '1']}]}}, expected: false},
      {name: 210, args: { code: { operator: 'veq', args: [ 'product', 'apple' ] } , data: {product: 'apple'}}, expected: true},
      {name: 212, args: { code: { operator: 'veq', args: [ 'product.name', 'apple' ] } , data: {product: {name: 'apple'}}}, expected: true},
      {name: 220, args: { code: { operator: 'isy', args: [ 'isRound' ] } , data: {isRound: 'y'}}, expected: true},
      {name: 230, args: { code: { operator: 'not', args: [{ operator: 'eq', args: ['1', '1']}]} , data: {isRound: 'y', isRed: 'n'}}, expected: false},
      {name: 232, args: { code: { operator: 'or', args: [{ operator: 'isy', args: ['isRound']},{ operator: 'isy', args: ['isRed']}]} , data: {isRound: 'y', isRed: 'n'}}, expected: true},
      {name: 240, args: { code: { operator: 'vin', args: ['product.category',{ operator: 'list', args: ['fruit', 'vegetable', 'grain']}]} , data: {product: {category: 'fruit'}}}, expected: true},
      {name: 242, args: { code: { operator: 'vin', args: ['product.category',{ operator: 'list', args: ['fruit', 'vegetable', 'grain']}]} , data: {product: {category: 'coffee'}}}, expected: false},
      {name: 250, args: { code: { operator: 'vge', args: [ 'product.price', 10 ] } , data: {product: {price: 15.0}}}, expected: true},
      {name: 252, args: { code: { operator: 'vge', args: [ 'product.price', 10 ] } , data: {product: {price: 5.0}}}, expected: false},
      {name: 260, args: { code: { operator: 'bw', args: [{ operator: 'get', args: ['product.price']},5,15]} , data: {product: {price: 10.0}}}, expected: true},
      {name: 262, args: { code: { operator: 'bw', args: [{ operator: 'get', args: ['product.price']},5,15]} , data: {product: {price: 20.0}}}, expected: false},
      {name: 270, args: { code: { operator: 'min', args: [{ operator: 'list', args: [1,10,11,101]}]} , data: {}}, expected: 1},
      {name: 272, args: { code: { operator: 'max', args: [{ operator: 'list', args: [1,10,11,101]}]} , data: {}}, expected: 101},
      {name: 274, args: { code: { operator: 'max', args: [{ operator: 'list', args: ['1', '10', '11', '101']}]} , data: {}}, expected: '11'},
      {name: 300, args: { code: { operator: 'map', args: [{ operator: 'get', args: ['product.name']},{ operator: 'list', args: ['apple', 'fruit', 'banana', 'fruit', 'tomato', 'vegetable']},'unknown']} , data: {product: {name: 'apple'}}}, expected: 'fruit'},
      {name: 302, args: { code: { operator: 'map', args: [{ operator: 'get', args: ['product.name']},{ operator: 'list', args: ['apple', 'fruit', 'banana', 'fruit', 'tomato', 'vegetable']},'unknown']} , data: {product: {name: 'kiwi'}}}, expected: 'unknown'},
      {name: 310, args: { code: { operator: 'join', args: [{ operator: 'get', args: ['fruits']}, ',']} , data: {fruits: ['apple', 'banana', 'kiwi']}}, expected: 'apple,banana,kiwi'},
      {name: 312, args: { code: { operator: 'split', args: [{ operator: 'get', args: ['fruits']}, ',']} , data: {fruits: 'apple,banana,kiwi'}}, expected: ['apple', 'banana', 'kiwi']},
      {name: 314, args: { code: { operator: 'sum', args: [{ operator: 'get', args: ['order.items.amount']}]} , data: {order: {items: [{amount: 100.0}, {amount: 200.0}, {amount: 300.0}]}}}, expected: 600},
      {name: 316, args: { code: { operator: "neg", args: [{operator: "get", args:["order.amount"]}]} , data: {order: {amount: 100.0}}}, expected: -100.0},
      {name: 317, args: { code: { operator: "neg", args: [{operator: "get", args:["order.items.amount"]}]} , data: {order: {items: [{amount: 100.0}, {amount: 200.0}]}}}, expected: [-100.0, -200.0]},
      {name: 318, args: { code: { operator: "inv", args: [{operator: "get", args:["order.amount"]}]}, data: {order: {amount: 10.0}}}, expected: 0.1},
      {name: 320, args: { code: { operator: "inv", args: [{operator: "get", args:["order.items.amount"]}]}, data: {order: {items: [{amount: 10.0}, {amount: 20.0}]}}}, expected: [0.1, 0.05]},
      {name: 322, args: { code: { operator: "mult", args :[{operator: "list", args: [0.8, {operator: "get", args: ["order.amount"]}]}]}, data: {order: {amount: 100.0}}}, expected: 80.0},
      {name: 324, args: { code: { operator: "rem", args: [{operator: "get", args:["order.amount"]},5]}, data: {order: {amount: 82.0}}}, expected: 2.0},
      {name: 326, args: { code: { operator: "sub", args: [{operator: "get", args:["order.amount"]},{"operator":"get","args":["order.tax"]}]}, data: {order: {amount: 82.5, tax: 2.5}}}, expected: 80.0},
      {name: 328, args: { code: { operator: "div", args: [{operator: "get", args:["order.amount"]},{"operator":"get","args":["order.items"]}]}, data: {order: {amount: 80.0, items: 4.0}}}, expected: 20.0},      
      {name: 330, args: {code: {operator: 'days',args: [{operator: 'get',args: ['fromDate']},{operator: 'get',args: ['endDate']}]}, data: {fromDate: '2022-06-17', endDate: '2022-06-17'}}, expected: 0},
      {name: 331, args: {code: {operator: 'days',args: ['2022-06-01', '2022-06-17']}, data: {}}, expected: 16},
      {name: 332, args: {code: {operator: 'days',args: [{operator: 'get',args: ['fromDate']},{operator: 'get',args: ['endDate']}]}, data: {fromDate: '2022-06-01', endDate: '2022-06-17'}}, expected: 16},
      {name: 334, args: {code: {operator: 'days',args: [{operator: 'get',args: ['fromDate']},{operator: 'get',args: ['endDate']}]}, data: {fromDate: '2022-06-17', endDate: '2022-06-01'}}, expected: -16},
      {name: 336, args: {code: {operator: 'days',args: [{operator: 'get',args: ['fromDate']},{operator: 'get',args: ['endDate']}]}, data: {fromDate: '', endDate: ''}}, expected: undefined},
      {name: 338, args: {code: {operator: 'days',args: [{operator: 'get',args: ['fromDate']},{operator: 'get',args: ['endDate']}]}, data: {fromDate: 'not-a-date', endDate: 'not-a-date'}}, expected: NaN},
      {name: 340, args: {code: {operator: 'vdays',args: ['fromDate','endDate']}, data: {fromDate: '2022-06-17', endDate: '2022-06-17'}}, expected: 0},
      {name: 342, args: {code: {operator: 'vdays',args: ['fromDate','endDate']}, data: {fromDate: '2022-06-01', endDate: '2022-06-17'}}, expected: 16},
      {name: 344, args: {code: {operator: 'vdays',args: ['fromDate','endDate']}, data: {fromDate: '2022-06-17', endDate: '2022-06-01'}}, expected: -16},
      {name: 346, args: {code: {operator: 'vdays',args: ['fromDate','endDate']}, data: {fromDate: '', endDate: ''}}, expected: undefined},
      {name: 348, args: {code: {operator: 'vdays',args: ['fromDate','endDate']}, data: {fromDate: 'not-a-date', endDate: 'not-a-date'}}, expected: NaN},
      {name: 350, args: {code: {operator: 'days',args:[{operator: 'today', args: []}, {operator: 'today', args: []}]}, data: {}}, expected: 0}
    ]
  },  
];

describe.each(scenarios)(
  "Test Group '$group'",
  (({group, fn, tests}) => {
    test.each(tests)(
      'Scenario $name ($#)',
      ({name, args, expected}) => {
        try {
          var received = undefined;
          try {
            received = fn(args);
          } catch (error) {
            if (expected !== '__error') {
              error.stack = undefined;
              throw error;
            }
            received = '__error';
          }
          expect(received).toBeEqual(expected, `${name}`);
          //expect(fn(args)).toBeEqual(expected, `${name}`);
        } catch(error) {
          error.stack = undefined;
          throw error;
        }
    });
  })
);