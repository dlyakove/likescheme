/* global expect */
const index = require('./index');

// extended expect handler to customize the message
expect.extend({
  toBeCustom(received, expected, custom) {
    let pass = true;
    let message = '';
    try {
      expect(received).toBe(expected);
    } catch (e) {
      pass = false;
      message = `Expect ${expected} Received ${received}`;
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
  {k: 100, a: 1, b: 1, r: 2},
  {k: 200, a: 2, b: 2, r: 4},
  {k: 300, a: 2, b: 3, r: 4},
  {k: 400, a: 2, b: 3, r: 4},
  {k: 500, a: 2, b: 3, r: 4},
];

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

/*
test('scenario 1', () => {
  expect(index.add(1, 2)).toBe(3);
});
test('scenario 2', () => {
  expect(index.add(1, 2)).toBe(1);
});
*/