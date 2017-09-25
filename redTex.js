export default function redTex(regl) {
  return regl.texture({
    width: 1, height: 1, data: [255, 0, 0, 255]
  });
};
