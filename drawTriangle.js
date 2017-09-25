import redTex from './redTex';

export default function drawTriangle(regl) {
  let hazard = redTex(regl);
  const hazardImg = new Image;
  hazardImg.src = '/hazard.png';
  hazardImg.onload = () => {
    hazard = regl.texture({ data: hazardImg, flipY: true });
  };

  return regl({
    frag: `
precision mediump float;

uniform sampler2D tex;
varying vec2 fr_TexCoord;

void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  gl_FragColor = texture2D(tex, fr_TexCoord);
}
`,
    vert: `
precision mediump float;
attribute vec3 position;
attribute vec2 texCoord;

varying vec2 fr_TexCoord;

void main() {
  fr_TexCoord = texCoord;
  gl_Position = vec4(position, 1.0);
}
`,
    attributes: {
      position: [[ 0.0, 0.8, 0.0],
                 [-0.8,-0.8, 0.0],
                 [ 0.8,-0.8, 0.0]],
      texCoord: [[ 0.5, 1.0],
                 [ 0.0, 0.0],
                 [ 1.0, 0.0]]
    },
    uniforms: {
      tex: () => hazard,
    },
    blend: {
      enable: true,
      func: {src: 'one', dst: 'one minus src alpha'}
    },
    count: 3,
  });
};
