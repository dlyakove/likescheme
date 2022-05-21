/* global expect */
const index = require('./index');
//import {parse, translate, compile, interpret, interpretJson} from './interpreter.js';

// extended expect handler to customize the message
expect.extend({
  toBeCustom(received, expected, custom) {
    let pass = true;
    let message = '';
    try {
      expect(received).toEqual(expected);
    } catch (e) {
      pass = false;
      message = `expected '${expected}' received '${received}'`;
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
    group: 'add',
    fn: (({a, b}) => a + b),
    //fn: (({a, b}) => index.add(a, b)),
    tests: [
      {name: 100, args: {a: 1, b: 1}, result: 2},
      {name: 200, args: {a: 2, b: 2}, result: 4},
      {name: 300, args: {a: 3, b: 2}, result: 5},
    ]
  },
  {
    group: 'parse',
    fn: (({code}) => index.parse(code)),
    tests: [
      {name: 100, args: {code: "[eq '1' '1']"}, result: ['eq', '1', '1']},
    ]
  },  
  {
    group: 'compile',
    fn: (({code}) => index.compile(code)),
    tests: [
      {name: 100, args: {code: "['eq' '1' '1']"}, result: {operator: 'eq', args: ['1', '1']}},
    ]
  },  
  {
    group: 'interpret text',
    fn: (({code, data}) => index.interpretText(code, data)),
    tests: [
      {name: 100, args: {code: "[eq '1' '1']", data: {}}, result: true},
      {name: 200, args: {code: "[veq 'sender.name' 'Acme']", data: {sender: {name: 'Acme'}}}, result: true},
      {name: 300, args: {code: "[isy 'isInsured']", data: {isInsured: 'y'}}, result: true},
    ]
  },  
  {
    group: 'interpret JSON',
    fn: (({code, data}) => index.interpretJson(code, data)),
    tests: [
      {name: 100, args: {code: {operator: 'eq', args: ['1', '1']}, data: {}}, result: true},
      {name: 200, args: {code: {operator: 'veq', args: ['sender.name', 'Acme']}, data: {sender: {name: 'Acme'}}}, result: true},
      {name: 300, args: {code: {operator: 'isy', args: ['isInsured']}, data: {isInsured: 'y'}}, result: true},
    ]
  },  
];

describe.each(scenarios)(
  "Test Group '$group'",
  (({fn, tests}) => {
    test.each(tests)(
      'Scenario $name ($#)',
      ({name, args, result}) => {
        try {
          expect(fn(args)).toBeCustom(result, `${name}`);
        } catch(error) {
          error.stack = undefined;
          throw error;
        }
    });
  })
);
    
/*
test.each(scenarios)(
    'scenario $k ($#)',
    ({k, a, b, r}) => {
    try {
      expect(index.add(a, b)).toBeCustom(r, `${k}`);
    } catch(error) {
      //console.log(`${k} my failure message`, error);
  //    throw `failure in ${k}`;
      error.stack = undefined;
      throw error;
    }
    //expect(index.add(a, b)).toBe(r);
  });
});
*/