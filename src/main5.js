import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";

// capsule
const scene = new THREE.Scene();

const geometry = new THREE.CapsuleGeometry(4, 4, 32, 64, 64);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const capsule = new THREE.Mesh(geometry, material);
scene.add(capsule);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  200,
);
camera.position.y = 10;
// camera.position.z = 5;

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
  capsule.rotation.y += THREE.MathUtils.degToRad(1);
  console.log(camera.position);
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
