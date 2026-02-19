import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
import { Pane } from "tweakpane";

//uvmapping on different shapes

//textures
const pane = new Pane();
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const torusknotGeomtery = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16);
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const texture1 = textureLoader.load("/static/uvmap.jpg");

// texture1.repeat.set(2, 2);
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

const mesh = new THREE.Mesh(geometry, material);
const mesh1 = new THREE.Mesh(planeGeometry, material);
const mesh2 = new THREE.Mesh(torusknotGeomtery, material);
const mesh3 = new THREE.Mesh(sphereGeometry, material);
const mesh4 = new THREE.Mesh(cylinderGeometry, material);
const light = new THREE.AmbientLight(0xffffff, 1);
const pointLight = new THREE.PointLight("white", 100, 0, 2);
pointLight.position.set(5, 5, 5);

mesh1.position.x = -2;
mesh2.position.x = 2;
mesh3.position.y = 2;
mesh4.position.y = -2;

scene.add(mesh1);
scene.add(mesh);
scene.add(mesh2);
scene.add(mesh3);
scene.add(mesh4);
scene.add(light);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
camera.position.z = 10;

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
  scene.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      child.rotation.y += THREE.MathUtils.degToRad(0.5);
    }
  });

  controls.update();
  console.log(camera.position);
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};
renderloop();
