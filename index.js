import fregl from 'regl';

// set up full window canvas + context
const regl = fregl();

const drawTriangle = regl({
  frag: `
precision mediump float;
uniform vec4 color;
void main() {
  gl_FragColor = color;
}`,
  vert: `
precision mediump float;
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`,
  attributes: {
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

  drawTriangle({
    color: [
      Math.cos(time * 0.3),
      Math.sin(time * 0.5),
      Math.cos(time * 0.2),
      1.0
    ]
  });
});
