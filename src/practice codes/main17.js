import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";

// 1. BASIC SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 5, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// 2. CREATE THE PATH (A to B to C curved track)
const curve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-10, 0, 10),
    new THREE.Vector3(-5, 5, 5),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(5, -5, 5),
    new THREE.Vector3(10, 0, 10),
  ],
  true,
); // 'true' makes it a closed loop!

// Let's draw a line so we can actually see the track
const trackGeometry = new THREE.BufferGeometry().setFromPoints(
  curve.getPoints(50),
);
const trackMaterial = new THREE.LineBasicMaterial({ color: 0x555555 });
const trackLine = new THREE.Line(trackGeometry, trackMaterial);
scene.add(trackLine);

// 3. CREATE THE MOVING OBJECT
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const movingBox = new THREE.Mesh(geometry, material);
scene.add(movingBox);

// 4. RAYCASTER (Click Detection) SETUP
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let isFollowing = false; // Toggle switch for the camera

window.addEventListener("dblclick", (event) => {
  // Convert mouse pixel coordinates to 3D normalized coordinates (-1 to +1)
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  // Check if we clicked the box
  const intersects = raycaster.intersectObject(movingBox);

  if (intersects.length > 0) {
    isFollowing = true; // Box clicked! Start following.
  } else {
    isFollowing = false; // Clicked empty space! Stop following.
  }
});

// 5. ANIMATION & CAMERA TETHER LOGIC
let trackPosition = 0; // Goes from 0.0 to 1.0 along the track
const previousObjectPosition = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);

  // A. Move the box along the track
  trackPosition += 0.002; // Speed
  if (trackPosition > 1) trackPosition = 0; // Loop back to start

  const currentObjectPosition = curve.getPointAt(trackPosition);
  movingBox.position.copy(currentObjectPosition);

  // B. The Camera Tether Math
  if (isFollowing) {
    // How far did the box move in this one frame?
    const delta = new THREE.Vector3().subVectors(
      currentObjectPosition,
      previousObjectPosition,
    );

    // Push the camera by that exact amount
    camera.position.add(delta);

    // Lock the camera's focus onto the box
    controls.target.copy(currentObjectPosition);
  }

  // C. Save the current position so we can calculate the delta on the next frame
  previousObjectPosition.copy(currentObjectPosition);

  controls.update();
  renderer.render(scene, camera);
}

animate();
