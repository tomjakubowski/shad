import fregl from 'regl';

// set up full window canvas + context
const regl = fregl();

const drawTriangle = regl({
  frag: `
precision mediump float;
varying vec4 fr_Color;

void main() {
  gl_FragColor = fr_Color;
}`,
  vert: `
precision mediump float;
attribute vec2 position;
attribute vec4 color;

varying vec4 fr_Color;

void main() {
  fr_Color = color;
  gl_Position = vec4(position, 0.0, 1.0);
}`,
  attributes: {
    color: regl.buffer([
      [1.0, 0.0, 0.0, 1.0],
      [0.0, 1.0, 0.0, 1.0],
      [0.0, 0.0, 1.0, 1.0],
    ]),
    position: regl.buffer([
      [-0.5 , -0.5 ],
      [ 0.5 , -0.5 ],
      [ 0.0 ,  0.0 ],
    ])
  },
  uniforms: {
    color: regl.prop('color')
  },
  count: 3
});

regl.frame(({time}) => {
  regl.clear({
    color: [0.0, 0.0, 0.0, 1.0],
    depth: 1.0
  })

  drawTriangle({});
});
