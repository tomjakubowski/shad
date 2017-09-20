// Copyright (C) 2017 Tom Jakubowski
//
// This file is part of shad, a silly shader thing.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
