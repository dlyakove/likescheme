// how to 'require' npm-nstalled likescheme in the CommonJS style module context
const likescheme = require('likescheme');
const evaluate = likescheme.evaluate;
const compile = likescheme.compile;
const parse = likescheme.parse;

// compile text-based code into JSON
console.log(
    compile(
        parse(
            "[and [isy 'isRound'] [isy 'isRed']]",
        )
    )
);

// evaluate text-based code
// NOTE: each function is enclosed in square brackets and the operands are space delimited
console.log(
    evaluate(
        "[and [isy 'isRound'] [isy 'isRed']]",
        {isRound: 'y', isRed: 'n'}
    )
);

// evaluating Array (list) based code
console.log(
    evaluate(
        ['and', ['isy', 'isRound'], ['isy', 'isRed']],
        {isRound: 'y', isRed: 'n'}
    )
);

// evaluating JSON-based code
console.log(
    evaluate(
        {
            operator: 'and', args: [
                { operator: 'isy', args: ['isRound']},
                { operator: 'isy', args: ['isRed']}
            ]
        },
        { isRound: 'y', isRed: 'n'}
    )
);

// nested objects - use 'dot' notation to reference the nested variables
console.log(
    evaluate(
        "[get 'product.price']",
        {product: {price: 150.0}}
    )
);

// lists
console.log(
    evaluate(
         {
             operator: 'sum', args: [
                 {operator: 'get', args: ['order.items.amount']}
             ]
         },
         {
             order: {
                 items: [
                     {amount: 100.0},
                     {amount: 200.0},
                     {amount: 300.0}
                 ]
             }
         }
    )
);

// strict mode
// if strict mode is 'true' (default), the following will throw an error
try {
    evaluate(
        "[get 'product.price']",
        {}
    );
} catch (error) {
  console.log(error);
}

// if strict mode is 'false', the following will return undefined
console.log(
    evaluate(
        "[get 'product.price']",
        {},
        false
    )
);