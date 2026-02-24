import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
import { Pane } from "tweakpane";

// repeat and wrapping of texture with realtime offsetmapping

//textures
const pane = new Pane();
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const texture1 = textureLoader.load("/static/space/1.png");

texture1.repeat.set(20, 20);
texture1.wrapS = THREE.RepeatWrapping;
texture1.wrapT = THREE.RepeatWrapping;

const material = new THREE.MeshPhysicalMaterial({ side: THREE.DoubleSide });
console.log(texture1);
material.map = texture1;

pane.addBinding(texture1, "offset", {
  x: {
    min: -1,
    max: 1,
    step: 0.001,
  },
  y: {
    min: -1,
    max: 1,
    step: 0.001,
  },
});

const mesh = new THREE.Mesh(planeGeometry, material);
const light = new THREE.AmbientLight(0xffffff, 1);
const pointLight = new THREE.PointLight("white", 100, 0, 2);
pointLight.position.set(5, 5, 5);
mesh.rotation.x = THREE.MathUtils.degToRad(90);
mesh.scale.set(1000, 1000);

scene.add(mesh);
scene.add(light);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
camera.position.y = 30;
camera.position.z = 60;
camera.position.x = 150;

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
  console.log(camera.position);
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};
renderloop();
