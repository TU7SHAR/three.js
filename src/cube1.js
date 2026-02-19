import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "../src/style.css";

console.log(OrbitControls);

//initializing scene
const scene = new THREE.Scene();

// adding objects to scene
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: "red" });
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cubeMesh);

// initializing the camera
// Perspective Camera
// const camera = new THREE.PerspectiveCamera(
//   35,
//   innerWidth / innerHeight,
//   0.5,
//   200,
// );

// initializing the camera from orthographic camera
// const aspectRatio = window.innerWidth / window.innerHeight;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   200,
// );
camera.position.z = 5;

// call canvas
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });

//setting up the controls for perspective
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.autoRotate = true;

window.addEventListener("resize", (e) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const renderloop = () => {
  controls.update();
  // render

  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};
renderloop();
