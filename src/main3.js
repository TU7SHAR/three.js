import * as THREE from "three";
// 1. Fixed Import Path
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(2, 4);
shape.lineTo(4, 0);
shape.lineTo(2, -1);
shape.lineTo(0, 0);

const geometry = new THREE.ShapeGeometry(shape);
geometry.center();

const material = new THREE.MeshBasicMaterial({
  color: 0x00ffcc,
  side: THREE.DoubleSide,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

camera.position.z = 10;

// 2. Fixed: Use renderer.domElement instead of the undefined 'canvas'
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
  requestAnimationFrame(animate);

  // 3. Fixed: Required for damping to work
  controls.update();

  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
