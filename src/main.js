import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { getLivePlanetData } from "./nasaApi";
import { planets } from "./planet";
import { addAsteroidBelt } from "./miscObject";
import { sunMaterial, planetMaterials, bgMap } from "./material";
import "./style.css";

//sidebar
const planetListUI = document.getElementById("planet-list");

planets.forEach((planet, index) => {
  const li = document.createElement("li");
  li.className = "planet-item";
  li.innerHTML = `<strong>${planet.name}</strong>`;
  li.addEventListener("click", () =>
    focusOnTarget(planetMeshes[index].mesh, planet),
  );
  planetListUI.appendChild(li);

  planet.moons.forEach((moon, moonIdx) => {
    // Use moonIdx here
    const moonLi = document.createElement("li");
    moonLi.className = "planet-item moon-item";
    moonLi.innerText = `↳ ${moon.name}`;

    moonLi.addEventListener("click", () => {
      // FIX: Select the moon mesh directly by its position in the array
      const moonMesh = planetMeshes[index].moons[moonIdx];
      if (moonMesh) focusOnTarget(moonMesh, moon);
    });

    planetListUI.appendChild(moonLi);
  });
});

function focusOnTarget(mesh, data) {
  currentTarget = mesh;
  isZooming = true;

  infoCard.style.display = "block";
  planetNameLabel.innerText = data.name;
  planetDescLabel.innerText = data.description;

  savedSpeed = sceneSettings.globalSpeed;
  // sceneSettings.globalSpeed = 0;
  pane.refresh();
}

const pane = new Pane();
const scene = new THREE.Scene();

//follow logic
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clickables = [];

let currentTarget = null;
const targetPosition = new THREE.Vector3();
const previousTargetPosition = new THREE.Vector3();
let isZooming = false;

// geometries only here
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);

const sceneSettings = {
  globalSpeed: 0.2,
  bloomPass: 0.5,
};

let savedSpeed = sceneSettings.globalSpeed;

const ScenePane = pane.addFolder({
  title: "SceneSettings",
  expanded: true,
});

ScenePane.addBinding(sceneSettings, "globalSpeed", {
  min: 0,
  max: 2,
  label: "Time Speed",
});

ScenePane.addBinding(sceneSettings, "bloomPass", {
  min: 0,
  max: 5,
  label: "Sun Intensity",
}).on("change", (event) => {
  if (bloomPass) bloomPass.strength = event.value;
});
scene.background = bgMap;

//Meshes called here
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.name = "Sun";
scene.add(sun);
clickables.push(sun);
currentTarget = sun;

const planetMeshes = planets.map((planet) => {
  const material = planetMaterials[planet.name];
  const planetMesh = new THREE.Mesh(sphereGeometry, material);
  scene.add(planetMesh);
  clickables.push(planetMesh);
  planetMesh.name = planet.name;

  const moonMeshes = planet.moons.map((moon) => {
    const moonMat =
      planetMaterials[moon.name] ||
      new THREE.MeshStandardMaterial({ color: 0xffffff });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMat);
    moonMesh.name = moon.name;
    planetMesh.add(moonMesh);
    clickables.push(moonMesh);
    return moonMesh;
  });

  return { mesh: planetMesh, moons: moonMeshes };
});
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
const pointLight = new THREE.PointLight(0xffffff, 3000);

// scenes here only
clickables.push(sun);

currentTarget = sun;
currentTarget.getWorldPosition(previousTargetPosition);

scene.add(sun, ambientLight, pointLight);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  500000,
);
camera.position.z = 30;
camera.position.y = 15;
sun.scale.setScalar(10);

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

//bloom logic from library
const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  sceneSettings.bloomPass,
  0.4,
  0.1,
);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight); // Add this!
});

const infoCard = document.getElementById("info-card");
const planetNameLabel = document.getElementById("planet-name");
const planetDescLabel = document.getElementById("planet-description");

window.addEventListener("click", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickables);

  if (intersects.length > 0) {
    const clickedObj = intersects[0].object;

    if (currentTarget !== clickedObj) {
      currentTarget = clickedObj;
      isZooming = true;

      const planetData = planets.find((p) => p.name === clickedObj.name);

      if (planetData) {
        infoCard.style.display = "block";
        planetNameLabel.innerText = planetData.name;
        planetDescLabel.innerText = planetData.description;
      } else if (clickedObj.name === "Sun") {
        infoCard.style.display = "none"; // Hide card if sun is clicked
      }
    }
  }
});

document.getElementById("close-btn").addEventListener("click", () => {
  currentTarget = sun;
  isZooming = true;
  infoCard.style.display = "none";
  sceneSettings.globalSpeed = savedSpeed;
  pane.refresh();
});

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

async function initUniverse() {
  const liveData = await getLivePlanetData();
  addAsteroidBelt(scene);
  if (liveData) {
    planets.forEach((planet) => {
      const live = liveData.find((d) => d.name === planet.name);
      if (live) {
        planet.eccentricity = live.eccentricity;
        planet.description += ` (Live Gravity: ${live.gravity})`;
      }
    });
  }

  rendererloop(); // Start the loop after data is ready
}

initUniverse();

planets.forEach((planet) => {
  const eccentricity = 1.2;
  const radius = planet.distance * 0.24; // Hardcoded distance scale

  const orbitGeom = new THREE.RingGeometry(radius, radius + 0.2, 128);
  const orbitMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.1,
  });
  const orbitRing = new THREE.Mesh(orbitGeom, orbitMat);

  orbitRing.rotation.x = Math.PI / 2;
  orbitRing.scale.set(eccentricity, 1, 1);
  scene.add(orbitRing);
});

const rendererloop = () => {
  // 1. Capture target position BEFORE movement
  const lastTargetPos = new THREE.Vector3();
  if (currentTarget) {
    currentTarget.getWorldPosition(lastTargetPos);
  }

  // --- START MOVEMENT LOGIC ---
  sun.rotation.y += 0.005 * sceneSettings.globalSpeed;

  planetMeshes.forEach((planetObj, planetIndex) => {
    const planetData = planets[planetIndex];
    planetObj.mesh.scale.setScalar(planetData.radius * 0.4);

    if (planetObj.orbitAngle === undefined) planetObj.orbitAngle = 0;

    if (sceneSettings.globalSpeed > 0) {
      planetObj.orbitAngle += planetData.speed * sceneSettings.globalSpeed;
    }

    planetObj.mesh.rotation.y += 0.002 + 0.02 * sceneSettings.globalSpeed;

    const currentPlanetDistance = planetData.distance * 0.24;
    const eccentricity = 1.2;

    planetObj.mesh.position.x =
      Math.sin(planetObj.orbitAngle) * (currentPlanetDistance * eccentricity);
    planetObj.mesh.position.z =
      Math.cos(planetObj.orbitAngle) * currentPlanetDistance;

    planetObj.moons.forEach((moonMesh, moonIndex) => {
      const moonData = planetData.moons[moonIndex];
      moonMesh.scale.setScalar(moonData.radius / planetData.radius);

      if (moonMesh.orbitAngle === undefined) moonMesh.orbitAngle = 0;

      if (sceneSettings.globalSpeed > 0) {
        moonMesh.orbitAngle += moonData.speed * sceneSettings.globalSpeed;
      }

      const currentMoonDistance =
        (moonData.distance * 0.24) / (planetData.radius * 0.4);

      moonMesh.position.x = Math.sin(moonMesh.orbitAngle) * currentMoonDistance;
      moonMesh.position.z = Math.cos(moonMesh.orbitAngle) * currentMoonDistance;
    });
  });
  // --- END MOVEMENT LOGIC ---

  // 2. Capture target position AFTER movement
  currentTarget.getWorldPosition(targetPosition);

  // 3. Calculate the movement delta
  const delta = new THREE.Vector3().subVectors(targetPosition, lastTargetPos);

  // 4. Update Camera Position and Controls Target
  // This "locks" the camera to the planet's travel path without rotating it
  camera.position.add(delta);
  controls.target.copy(targetPosition);

  if (isZooming) {
    const objectSize = currentTarget.scale.x;
    const distanceMultiplier = currentTarget === sun ? 3 : 6;
    const idealDistance = objectSize * distanceMultiplier;

    const toCamera = new THREE.Vector3().subVectors(
      camera.position,
      targetPosition,
    );
    const currentDistance = toCamera.length();

    // Smoothly lerp the distance while maintaining the angle
    const newDistance = THREE.MathUtils.lerp(
      currentDistance,
      idealDistance,
      0.05,
    );

    toCamera.normalize().multiplyScalar(newDistance);
    camera.position.copy(targetPosition).add(toCamera);

    if (Math.abs(currentDistance - idealDistance) < objectSize * 0.05) {
      isZooming = false;
    }
  }

  // Final updates
  previousTargetPosition.copy(targetPosition);
  controls.update();
  composer.render();
  window.requestAnimationFrame(rendererloop);
};

rendererloop();
