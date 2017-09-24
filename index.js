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

import fregl from 'regl';
import {clamp} from './util';

// set up full window canvas + context
const regl = fregl();

regl.clear({
  color: [0.0, 0.0, 0.0, 1.0],
  depth: 1.0
});

const triangle = regl({
  frag: `
precision mediump float;
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`,
  vert: `
precision mediump float;
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,
  attributes: {
    position: [[ 0.0,  0.8],
               [-0.8, -0.8],
               [ 0.8, -0.8]],
  },
  count: 3
})();
