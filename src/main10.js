import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
import { Pane } from "tweakpane";
//foggy environment
const pane = new Pane();
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.MeshBasicMaterial();

const fog = new THREE.Fog("white", 1, 10);
scene.fog = fog;
scene.background = new THREE.Color("white");

// material.side = THREE.DoubleSide;
material.side = THREE.FrontSide;
material.fog = true;
material.color = new THREE.Color("red");
material.transparent = true;
material.opacity = 0.3;

const mesh = new THREE.Mesh(geometry, material);
const mesh1 = new THREE.Mesh(geometry, material);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.x = 2;
mesh1.position.x = -2;
scene.add(mesh);
scene.add(mesh1);
scene.add(plane);

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
renderer.setPixelRatio(window.setPixelRatio);

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
