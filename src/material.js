// textures here!!

import * as THREE from "three";

// setups
const textureLoader = new THREE.TextureLoader();
const loader = new THREE.CubeTextureLoader().setPath(
  "./static/planets/cubemap_milkyway/",
);

// loaders
const loadTexture = (path) => {
  const tex = textureLoader.load(path);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

export const bgMap = await loader.loadAsync([
  "px.png",
  "nx.png",
  "py.png",
  "ny.png",
  "pz.png",
  "nz.png",
]);

// material only here
export const sunMaterial = new THREE.MeshBasicMaterial({
  map: loadTexture("./static/planets/sun.jpg"),
});
export const planetMaterials = {
  Mercury: new THREE.MeshStandardMaterial({
    map: loadTexture("./static/planets/mercury.jpg"),
  }),
  Venus: new THREE.MeshStandardMaterial({
    map: loadTexture("./static/planets/venus.jpg"),
  }),
  Earth: new THREE.MeshStandardMaterial({
    map: loadTexture("./static/planets/earth.jpg"),
  }),
  Mars: new THREE.MeshStandardMaterial({
    map: loadTexture("./static/planets/mars.jpg"),
  }),
  Jupiter: new THREE.MeshStandardMaterial({
    map: loadTexture("./static/planets/jupiter.jpg"),
  }),
  Saturn: new THREE.MeshStandardMaterial({
    map: loadTexture("./static/planets/saturn.jpg"),
  }),
  Uranus: new THREE.MeshStandardMaterial({
    map: loadTexture("./static/planets/uranus.jpg"),
  }),
  Neptune: new THREE.MeshStandardMaterial({
    map: loadTexture("./static/planets/neptune.jpg"),
  }),
  Moon: new THREE.MeshStandardMaterial({
    map: loadTexture("./static/planets/moon.jpg"),
  }),
};
