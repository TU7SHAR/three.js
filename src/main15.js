import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
import { Pane } from "tweakpane";

//texture with full mapping

const pane = new Pane();
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

const geometry = new THREE.BoxGeometry(1, 1, 1, 128, 128, 128);
const torusknotGeomtery = new THREE.TorusKnotGeometry(0.3, 0.1, 256, 64);
const planeGeometry = new THREE.PlaneGeometry(1, 1, 128, 128);
const sphereGeometry = new THREE.SphereGeometry(0.5, 128, 128);
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 128, 128);

// 2. LOAD TEXTURES WITH CORRECT COLORSPACE
const textureAlbedo = textureLoader.load("/static/rsm/albedo.png");
textureAlbedo.colorSpace = THREE.SRGBColorSpace; //only albedos should srgb

const textureAo = textureLoader.load("/static/rsm/ao.png");
const texturHeight = textureLoader.load("/static/rsm/height.png");
const textureMetallic = textureLoader.load("/static/rsm/metallic.png");
const textureRoughness = textureLoader.load("/static/rsm/roughness.png");
const textureNormal = textureLoader.load("/static/rsm/normal-ogl.png");

const material = new THREE.MeshPhysicalMaterial({
  side: THREE.DoubleSide,
  map: textureAlbedo,
  roughnessMap: textureRoughness,
  metalnessMap: textureMetallic,
  normalMap: textureNormal,
  aoMap: textureAo,
  // Displacement settings
  displacementMap: texturHeight,
  displacementScale: 0.05,
  displacementBias: 0,
});

const mesh = new THREE.Mesh(geometry, material);
const mesh1 = new THREE.Mesh(planeGeometry, material);
const mesh2 = new THREE.Mesh(torusknotGeomtery, material);
const mesh3 = new THREE.Mesh(sphereGeometry, material);
const mesh4 = new THREE.Mesh(cylinderGeometry, material);

[mesh, mesh1, mesh2, mesh3, mesh4].forEach((m) => {
  m.geometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(m.geometry.attributes.uv.array, 2),
  );
  scene.add(m);
});

const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

const pointLight = new THREE.PointLight("white", 1000, 0, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

pane.addBinding(material, "displacementScale", {
  min: 0,
  max: 0.5,
  step: 0.01,
});
pane.addBinding(material, "metalness", { min: 0, max: 1 });
pane.addBinding(material, "roughness", { min: 0, max: 1 });
pane.addBinding(material, "aoMapIntensity", { min: 0, max: 1, step: 0.01 });

mesh1.position.x = -2;
mesh2.position.x = 2;
mesh3.position.y = 2;
mesh4.position.y = -2;

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
      child.rotation.y += 0.005;
    }
  });
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};
renderloop();
