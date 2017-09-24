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
import baboon from 'baboon-image';

// set up full window canvas + context
const regl = fregl();

regl.clear({
  color: [0.0, 0.0, 0.0, 1.0],
  depth: 1.0
});

const checker = regl.texture({
  data: [255, 0, 255, 255,  0, 255, 0, 255,
         0, 255, 255, 255,  0, 0, 255, 255],
  width: 2,
  height: 2,
  mag: 'linear',
});

const HazardImg = new Image();
HazardImg.src = '/hazard.png';
HazardImg.onload = () => {
  hazard = regl.texture({
    data: HazardImg,
    min: 'linear',
    mag: 'linear',
    flipY: true
  });
};
let hazard = checker;
const baboonTex = regl.texture({data: baboon, flipY: true});

const drawTriangle = regl({
  frag: `
precision mediump float;

uniform sampler2D tex;
varying vec2 fr_TexCoord;

void main() {
  gl_FragColor = texture2D(tex, fr_TexCoord);
}
`,
  vert: `
precision mediump float;
attribute vec2 position;
attribute vec2 texCoord;

varying vec2 fr_TexCoord;

void main() {
  fr_TexCoord = texCoord;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,
  attributes: {
    position: [[ 0.0,  0.8],
               [-0.8, -0.8],
               [ 0.8, -0.8]],
    texCoord: [[ 0.5,  1.0],
               [ 0.0,  0.0],
               [ 1.0,  0.0]]
  },
  uniforms: {
    tex: () => hazard
  },
  count: 3
});

regl.frame(({time}) => {
  regl.clear({
    color: [0, 0, 0, 1]
  });
  drawTriangle();
});
