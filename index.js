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
import baboonData from 'baboon-image';
import mat4 from 'gl-mat4';

import cube from './cube';

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

const baboon = regl.texture({data: baboonData, flipY: true, mipmap: true, min: 'mipmap'});

const camera = {
  matrix: mat4.lookAt(mat4.create(), [4.0, 4.0, 4.0], [0, 0, 0], [0, 1, 0])
};

const drawCube = regl({
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
uniform mat4 model;
uniform mat4 camera;
uniform mat4 proj;
attribute vec3 position;
attribute vec2 texCoord;

varying vec2 fr_TexCoord;

void main() {
  fr_TexCoord = texCoord;
  gl_Position = proj * camera * model * vec4(position, 1.0);
}
`,
  attributes: {
    position: cube.position,
    texCoord: cube.texCoord,
  },
  uniforms: {
    camera: camera.matrix,
    model: ({time}, props) =>
      mat4.rotate(mat4.create(), mat4.create(), props.angle||0, props.axis||[0,1,0]),
    proj: ({viewportWidth, viewportHeight}) =>
      mat4.perspective(mat4.create(), 45.0/360.0*2*Math.PI, viewportWidth / viewportHeight,
                       0.1, 10.0),
    tex: baboon,
  },
  depth: {
    enable: true, // this is a default in regl, which is interesting...
  },
  count: 6*2*3,
});

regl.frame(({time}) => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  });
  drawCube({
    angle: time % (2*Math.PI),
    axis: [0, Math.sqrt(2), Math.sqrt(2)],
  });
});
