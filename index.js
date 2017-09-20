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

const vertsFromStops = (stops) => {
  const verts = [];
  for (let stop of stops) {
    // clamp stop to [0..1], then remap to [-1,1]
    stop = 2.0 * clamp(stop, 0.0, 1.0) - 1.0;
    verts.push([stop,  1.0]);
    verts.push([stop, -1.0]);
  }
  return verts;
};

const vertsFromColors = (colors) => {
  const verts = [];
  for (let col of colors) {
    verts.push(col);
    verts.push(col);
  }
  return verts;
};

// console.table(vertsFromStops([0.0, 0.5, 1.0]));

let once = false;
const drawAALinearGradient = regl({
  frag: `
precision mediump float;
varying vec4 fr_Color;
uniform float brightness;

void main() {
  gl_FragColor = vec4(brightness * fr_Color.rgb, fr_Color.a);
}`,
  vert: `
precision mediump float;
attribute vec2 position;
attribute vec4 color;

varying vec4 fr_Color;

uniform float dbg;

void main() {
  fr_Color = color;
  gl_Position = vec4(position, 0.0, 1.0);
}`,
  attributes: {
    color: regl.prop('colors'),
    position: regl.prop('stops')
  },
  uniforms: {
    brightness: (context, props, batchId) => {
      if (!once) {
        once = true;
        console.log(props);
      }
      return 1.0;
    },
  },
  primitive: 'triangle strip',
  count: 6
});

regl.frame(({time}) => {
  regl.clear({
    color: [0.0, 0.0, 0.0, 1.0],
    depth: 1.0
  })

  drawAALinearGradient({
    brightness: 0.1 * Math.sin(time) + 1.5,
    stops: vertsFromStops([0.0, 0.25 * Maths.in(time) + 0.5, 1.0]),
    colors: vertsFromColors([[0.1, 1.0, 0.1, 1], [1.0, 0.1, 0.1, 1], [0.1, 1.0, 0.1, 1]])
  });
});
