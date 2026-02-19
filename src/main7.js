import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";

const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(16, 32, 16, 0, 6.5, 6.5);
const material = new THREE.MeshBasicMaterial({
  color: "orange",
  wireframe: true,
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  200,
);
// camera.position.x = 20;
// camera.position.z = 5;
camera.position.y = 28;

// Initializing the renderer
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Pro-tip: limit to 2 for performance

// Instantiate the controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const renderloop = () => {
  controls.update();
  //   sphere.rotation.x += THREE.MathUtils.degToRad(1);
  sphere.rotation.y += THREE.MathUtils.degToRad(359);
  //   sphere.rotation.z += THREE.MathUtils.degToRad(1);
  console.log(camera.position);
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
