import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
import "./style.css";

// texture practicing and integrating patterns with canvas

const scene = new THREE.Scene();
const pane = new Pane();
const textureLoader = new THREE.TextureLoader();

const sGeometry = new THREE.SphereGeometry(0.9, 128, 128);

//texture-grass
const textureGrassAlbedo = textureLoader.load("/static/grass/albedo.png");
textureGrassAlbedo.colorSpace = THREE.SRGBColorSpace; //only albedos should srgb
const textureGrassAo = textureLoader.load("/static/grass/ao.png");
const textureGrassHeight = textureLoader.load("/static/grass/height.png");
const textureGrassMetallic = textureLoader.load("/static/grass/metallic.png");
const textureGrassRoughness = textureLoader.load("/static/grass/roughness.png");
const textureGrassNormal = textureLoader.load("/static/grass/normal-ogl.png");

// texture-rock
const textureRockAlbedo = textureLoader.load("/static/rock/albedo.png");
textureRockAlbedo.colorSpace = THREE.SRGBColorSpace;
const textureRockAo = textureLoader.load("/static/rock/ao.png");
const textureRockHeight = textureLoader.load("/static/rock/height.png");
const textureRockMetallic = textureLoader.load("/static/rock/metallic.png");
const textureRockRoughness = textureLoader.load("/static/rock/roughness.png");
const textureRockNormal = textureLoader.load("/static/rock/normal-ogl.png");

// texture-gold
const textureGoldAlbedo = textureLoader.load("/static/gold/albedo.png");
textureGoldAlbedo.colorSpace = THREE.SRGBColorSpace;
const textureGoldAo = textureLoader.load("/static/gold/ao.png");
const textureGoldHeight = textureLoader.load("/static/gold/height.png");
const textureGoldMetallic = textureLoader.load("/static/gold/metallic.png");
const textureGoldRoughness = textureLoader.load("/static/gold/roughness.png");
const textureGoldNormal = textureLoader.load("/static/gold/normal-ogl.png");

const materialGrass = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  map: textureGrassAlbedo,
  roughnessMap: textureGrassRoughness,
  metalnessMap: textureGrassMetallic,
  normalMap: textureGrassNormal,
  aoMap: textureGrassAo,
  // Displacement settings
  displacementMap: textureGrassHeight,
  displacementScale: 0.05,
  displacementBias: 0,
});
const GrassPane = pane.addFolder({
  title: "Grass",
  expanded: true,
});
GrassPane.addBinding(materialGrass, "displacementScale", {
  min: 0,
  max: 0.5,
  step: 0.01,
});
GrassPane.addBinding(materialGrass, "metalness", { min: 0, max: 1 });
GrassPane.addBinding(materialGrass, "roughness", { min: 0, max: 1 });
GrassPane.addBinding(materialGrass, "aoMapIntensity", {
  min: 0,
  max: 1,
  step: 0.01,
});

const materialRock = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  map: textureRockAlbedo,
  roughnessMap: textureRockRoughness,
  metalnessMap: textureRockMetallic,
  normalMap: textureRockNormal,
  aoMap: textureRockAo,
  // Displacement settings
  displacementMap: textureRockHeight,
  displacementScale: 0.05,
  displacementBias: 0,
});
const RockPane = pane.addFolder({
  title: "Rock",
  expanded: false,
});
RockPane.addBinding(materialRock, "displacementScale", {
  min: 0,
  max: 0.5,
  step: 0.01,
});
RockPane.addBinding(materialRock, "metalness", { min: 0, max: 1 });
RockPane.addBinding(materialRock, "roughness", { min: 0, max: 1 });
RockPane.addBinding(materialRock, "aoMapIntensity", {
  min: 0,
  max: 1,
  step: 0.01,
});

const materialGold = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  map: textureGoldAlbedo,
  roughnessMap: textureGoldRoughness,
  metalnessMap: textureGoldMetallic,
  normalMap: textureGoldNormal,
  aoMap: textureGoldAo,
  // Displacement settings
  displacementMap: textureGoldHeight,
  displacementScale: 0.05,
  displacementBias: 0,
});
const GoldPane = pane.addFolder({
  title: "Gold",
  expanded: false,
});
GoldPane.addBinding(materialGold, "displacementScale", {
  min: 0,
  max: 0.5,
  step: 0.01,
});
GoldPane.addBinding(materialGold, "metalness", { min: 0, max: 1 });
GoldPane.addBinding(materialGold, "roughness", { min: 0, max: 1 });
GoldPane.addBinding(materialGold, "aoMapIntensity", {
  min: 0,
  max: 1,
  step: 0.01,
});

const mesh1 = new THREE.Mesh(sGeometry, materialRock);
const mesh2 = new THREE.Mesh(sGeometry, materialGold);
const mesh3 = new THREE.Mesh(sGeometry, materialGrass);

mesh2.position.x = -4;
mesh3.position.x = 4;

scene.add(mesh1, mesh2, mesh3);

scene.children.forEach((child) => {
  if (child instanceof THREE.Mesh) {
    child.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(child.geometry.attributes.uv.array, 2),
    );
  }
});

const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

const pointLight = new THREE.PointLight("white", 500, 0, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
camera.position.z = 10;

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderloop = () => {
  scene.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      child.rotation.y += THREE.MathUtils.degToRad(0.4);
    }
  });
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};
renderloop();

// labelling for spheres

const createLabel = (text, targetMesh) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  context.fillStyle = "gray";
  context.font = "Bold 500px Arial";
  context.textAlign = "center";
  context.fillText(text, 950, 800);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);

  sprite.position.set(0, 1.5, 0);
  sprite.scale.set(1.5, 0.75, 1);

  targetMesh.add(sprite);
};

createLabel("ROCK", mesh1);
createLabel("GOLD", mesh2);
createLabel("GRASS", mesh3);
