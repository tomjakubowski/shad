import {test} from 'ava';
import {clamp} from '../util';

test('clamp', t => {
  const min = 0.4, max = 9.3;
  t.true(max > min);
  // value to pass to clamp(_, min, max), followed by expected return value
  const cases = [
    [min, min],
    [min - 1.0, min],
    [min - 0.00001, min],
    [(max - min) / 2.0, (max - min) / 2.0],
    [max, max],
    [max + 37.0, max],
  ];
  for (let [x, expected] of cases) {
    t.is(clamp(x, min, max), expected);
  }
});
