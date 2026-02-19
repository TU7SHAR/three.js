import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";

const scene = new THREE.Scene();

const vertices = new Float32Array([
  0, 1, 0, -1, -1, 1, 1, -1, 1, 0, 1, 0, 1, -1, 1, 1, -1, -1, 0, 1, 0, 1, -1,
  -1, -1, -1, -1, 0, 1, 0, -1, -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1,
  -1, -1, -1, 1, 1, -1, -1, -1, -1, -1,
]);
const bufferAttr = new THREE.BufferAttribute(vertices, 3);
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", bufferAttr);

const material = new THREE.MeshBasicMaterial({
  color: "gold",
  wireframe: true,
});

const meshMaterial = new THREE.Mesh(geometry, material);
scene.add(meshMaterial);
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  200,
);
camera.position.z = 5;

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};
renderloop();
