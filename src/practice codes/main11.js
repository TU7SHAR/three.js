import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
import { Pane } from "tweakpane";
import { shininess } from "three/tsl";

const pane = new Pane();
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const torusknotGeomtery = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16);

// const material = new THREE.MeshLambertMaterial();
const material = new THREE.MeshPhongMaterial();
material.color = new THREE.Color("red");
pane.addBinding(material, "shininess", {
  min: 0,
  max: 100,
  step: 1,
});

const mesh = new THREE.Mesh(geometry, material);
const mesh1 = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(torusknotGeomtery, material);

const light = new THREE.AmbientLight(0xffffff, 0.3);
const pointLight = new THREE.PointLight("white", 2000, 0, 2);
console.log(pointLight);
pointLight.position.set(5, 5, 5);
mesh1.position.x = -2;
mesh2.position.x = 2;

scene.add(mesh1);
scene.add(mesh);
scene.add(mesh2);
scene.add(light);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  200,
);
camera.position.z = 5;

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};
renderloop();
