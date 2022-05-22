// how to 'require' locally installed likescheme in the CommonJS style module context
const index = require('./index.cjs');
const evaluate = index.evaluate;

// evaluating text-based code
console.log(evaluate("[and [isy 'isRound'] [isy 'isRed']]", {isRound: 'y', isRed: 'n'}));

// evaluating JSON-based code
console.log(evaluate({ operator: 'or', args: [{ operator: 'isy', args: ['isRound']},{ operator: 'isy', args: ['isRed']}]}, {isRound: 'y', isRed: 'n'}));