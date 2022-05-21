var strictMode = true;

const g = (l, data) => {
  //console.log(l)
  //console.log(data)
  if(data === undefined) {
    return undefined;
  }
  if(data instanceof Array) {
    //console.log(`${l} is Array`)
    var v = [];
    data.forEach((e, i) => {
      //console.log('v', v, 'l', l, 'e', e, 'g', g(l, data[i]))
      v.push(g(l, e));
      //v.push(g(l, data[i]));
    });
    //console.log(v.join('-'))
    return v; //v.join('-');
    //return undefined;
  }
  const p = l.split('.'); // biller.name -> ['biller', 'name']
  if (p.length > 1) {
    //console.log(`p: ${p.slice(1)}, p[0]: ${p[0]}, data: ${data[p[0]]}`)
    return g(p.slice(1).join('.'), data[p[0]]);
  }
  return data[p[0]];
};

const isList = (v => {
  if (!(v instanceof Array)) {
    throw 'not a list';
  }
  return true;
});

const f = {
  'var': (l, data) => {
    const v = g(l[0], data); //data[l[0]];
    //if(data[l[0]] === undefined) {
    if(v === undefined && strictMode) {
      throw `Unknown data attribute ${l[0]}`;
    }
    return v;
    //return data[l[0]];
  },
  '$': (l, data) => f.var(l, data),
  //'val': (l) => l[0],
  'list': (l) => l,
  'low': (l) => l.map(v => v ? v.toLowerCase() : v),
  'eq': (l) => l[0] === l[1],
  'veq': (l, data) => f.var([l[0]], data) === l[1],
  'ne': (l) => l[0] !== l[1],
  'vne': (l, data) => f.var([l[0]], data) !== l[1],
  'ge': (l) => l[0] >= l[1],
  'vge': (l, data) => f.var([l[0]], data) >= l[1],
  'gt': (l) => l[0] > l[1],
  'vgt': (l, data) => f.var([l[0]], data) > l[1],
  'le': (l) => l[0] <= l[1],
  'vle': (l, data) => f.var([l[0]], data) <= l[1],
  'lt': (l) => l[0] < l[1],
  'vlt': (l, data) => f.var([l[0]], data) < l[1],
  'in': (l) => Array.isArray(l[0]) ? l[0].some(v => l[1].includes(v)) : l[1].includes(l[0]),
  'vin': (l, data) => f.in([f.var(l, data), l[1]]),
  'bw': (l) => Array.isArray(l[0]) ? l[0].some(v => (l[1] <= v && v <= l[2])) : (l[1] <= l[0] && l[0] <= l[2]), // between, closed, "some", if list
  //'or': (l) => l[0] || l[1],
  'or': (l) => l.some(v => v),
  //'and': (l) => l[0] && l[1],
  'and': (l) => l.every(v => v),
  'not': (l) => !l[0],
  'isy': (l, data) => f.in([f.low([f.var(l, data)]), ['yes', 'y']]),
  'isyu': (l, data) => f.in([f.low([f.var(l, data)]), ['yes', 'y', 'na']]),
  'isn': (l, data) => f.in([f.low([f.var(l, data)]), ['n', 'no']]),
  'isnu': (l, data) => f.in([f.low([f.var(l, data)]), ['n', 'no', 'na']]),
  'isu': (l, data) => f.in([f.low([f.var(l, data)]), ['na']]),
  'j': (l) => f.join(l),
  'join': (l) => isList(l[0]) ? l[0].join(l[1]) : undefined, // throws an error if not a list
  'split': (l) => isList(l[0]) ? [].concat(...l[0].map(c => c.split(l[1]))) : l[0].split(l[1]),
  'uniq': (l) => isList(l[0]) ? Array.from(new Set(l[0])) : l[0],
  'usort': (l) => isList(l[0]) ? f.uniq(l).sort() : l[0],
  'len': (l) => l[0].length,
  'sum': (l) => isList(l[0]) ? l[0].filter(c => c !== undefined && c !== null).reduce((p, c) => p = (p === undefined ? 0 : p) + c, undefined) : undefined,
  'min': (l) => isList(l[0]) ? l[0].filter(c => c !== undefined).reduce((p, c) => p < c ? p : c, undefined) : undefined,
  'max': (l) => isList(l[0]) ? l[0].filter(c => c !== undefined).reduce((p, c) => p > c ? p : c, undefined) : undefined,
  'map': (l) => {
    // l[0] - value
    // l[1] - map [k1, v1, k2, v2, ...] => [[k1, v1], [k2, v2]] => fromEntries => {k1: v1, k2: v2, ...}
    // l[2] - default value
    return (v => v === undefined ? l[2] : v)(Object.fromEntries(l[1].reduce((p, c, i) => {if(!(i%2)){p.push([c])} else {p[p.length-1].push(c)} return p}, []))[l[0]]);
  }
};

const evaluate = (l, data) => {
  //console.log('evaluate', l, 'data', data);
  const op = l[0];
  const val = l.slice(1).reduce((p, c) => {
    if (Array.isArray(c)) {
      p.push(evaluate(c, data));
    } else {
      p.push(c);
    }
    return p;
  }, []);
  //console.log('return', f[op](val, data));
  if(f[op] === undefined) {
    throw `Unknown operation ${op}`;
  }
  return f[op](val, data);
};

const evaluateJson = (j, data) => {
  const op = j.operator;
  const val = j.args.reduce((p, c) => {
    //if (Array.isArray(c)) {
    if (typeof c === 'object' &&
        !Array.isArray(c) &&
        c !== null) {
      p.push(evaluateJson(c, data));
    } else {
      p.push(c);
    }
    return p;
  }, []);
  if(f[op] === undefined) {
    throw `Unknown operation ${op}`;
  }
  return f[op](val, data);
};

const parse = (code => {
  return JSON.parse(code
    .replace(/'([^']+)'/g, (m) => m.replace(/ /g, '%%_%%'))
    .replace(/\[([a-zA-Z\$]+)/g, "['$1'")
    .replace(/'/g, '"')
    .replace(/ /g, ",")
    .replace(/%%_%%/g, " ")
    );
});

const interpret = (code, data, strict=true) => {
  
  strictMode = strict; // if true, unknown variables throw error, else they are set to undefined
  
  return evaluate(parse(code), data);
};

const interpretJson = (code, data, strict=true) => {
  
  strictMode = strict; // if true, unknown variables throw error, else they are set to undefined
  
  return evaluateJson(code, data);
};

const translate = (l, data) => {
  //console.log('evaluate', l, 'data', data);
  const op = l[0];
  const val = l.slice(1).reduce((p, c) => {
    if (Array.isArray(c)) {
      p.push(translate(c, data));
    } else {
      p.push(c);
    }
    return p;
  }, []);
  //console.log('return', f[op](val, data));
  if(f[op] === undefined) {
    throw `Unknown operation ${op}`;
  }
  return {operator: op, args: val};
  //return f[op](val, data);
};

const compile = (code) => {
  return translate(parse(code));
};

module.exports = {
  interpret,
  interpretJson,
  compile,
  parse,
  translate
};
//exports.interpretJson = interpretJson;
//exports.compile = compile;
//exports.parse = parse;
//exports.translate = translate;