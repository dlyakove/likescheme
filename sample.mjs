import {evaluate} from './index.mjs';

// evaluating text-based code
console.log(evaluate("[and [isy 'isRound'] [isy 'isRed']]", {isRound: 'y', isRed: 'n'}));

// evaluating JSON-based code
console.log(evaluate({ operator: 'or', args: [{ operator: 'isy', args: ['isRound']},{ operator: 'isy', args: ['isRed']}]}, {isRound: 'y', isRed: 'n'}));