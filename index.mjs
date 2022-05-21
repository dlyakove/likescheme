'use strict';

import {_parse, _compile, _evaluate} from './interpreter.cjs';

export const parse = _parse;
export const compile = _compile;
export const evaluate = _evaluate;