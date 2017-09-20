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
