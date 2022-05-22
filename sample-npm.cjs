// how to 'require' npm-nstalled likescheme in the CommonJS style module context
const index = require('likescheme');

// evaluating text-based code
console.log(index.evaluate("[and [isy 'isRound'] [isy 'isRed']]", {isRound: 'y', isRed: 'n'}));

// evaluating JSON-based code
console.log(index.evaluate({ operator: 'or', args: [{ operator: 'isy', args: ['isRound']},{ operator: 'isy', args: ['isRed']}]}, {isRound: 'y', isRed: 'n'}));