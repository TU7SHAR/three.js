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
import { OrbitEngine } from "./orbit.js";
import "./style.css";

const pane = new Pane();
const engine = new OrbitEngine();
const scene = new THREE.Scene();
scene.background = bgMap;

// --- STATE & UI ---
const planetListUI = document.getElementById("planet-list");
const moonSidebar = document.getElementById("moon-sidebar");
const moonListUI = document.getElementById("moon-list");
const infoCard = document.getElementById("info-card");
const planetNameLabel = document.getElementById("planet-name");
const planetDescLabel = document.getElementById("planet-description");

let asteroidBeltMesh;
let currentTarget = null;
let isZooming = false;
const targetPosition = new THREE.Vector3();
const lastTargetPos = new THREE.Vector3();
const clickables = [];
const sceneSettings = {
  globalSpeed: 0.2,
  bloomPass: 1.2,
  orbitIntensity: 0.03,
};
let savedSpeed = sceneSettings.globalSpeed;

// --- CORE OBJECTS ---
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.name = "Sun";
sun.scale.setScalar(30);
scene.add(sun);
clickables.push(sun);
currentTarget = sun;

const orbitRingsGroup = new THREE.Group();
scene.add(orbitRingsGroup);

const planetMeshes = planets.map((planet, index) => {
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
    planetMesh.add(moonMesh);
    clickables.push(moonMesh);
    return moonMesh;
  });

  return { mesh: planetMesh, moons: moonMeshes, index: index };
});

// --- LIGHTING ---
scene.add(new THREE.AmbientLight(0xffffff, 0.1));
const pointLight = new THREE.PointLight(0xffffff, 2000, 1000000);
pointLight.decay = 1;
scene.add(pointLight);

// --- RENDERER & CAMERA ---
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  20000000,
);
camera.position.set(0, 50, 100);

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  logarithmicDepthBuffer: true, // Stops clipping through moons
});
renderer.setSize(window.innerWidth, window.innerHeight);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  sceneSettings.bloomPass,
  0.4,
  0.1,
);
composer.addPass(bloomPass);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// --- TWEAKPANE ---
const ScenePane = pane.addFolder({ title: "SceneSettings", expanded: true });
ScenePane.addBinding(sceneSettings, "globalSpeed", {
  min: 0,
  max: 2,
  label: "Time Speed",
});
ScenePane.addBinding(sceneSettings, "bloomPass", {
  min: 0,
  max: 5,
  label: "Sun Intensity",
}).on("change", (e) => {
  bloomPass.strength = e.value;
});
ScenePane.addBinding(sceneSettings, "orbitIntensity", {
  min: 0,
  max: 1,
  label: "Orbit Intensity",
}).on("change", (e) => {
  orbitRingsGroup.children.forEach((ring) => {
    if (ring.material) ring.material.opacity = e.value;
  });
});

// --- FUNCTIONS ---
function updateOrbitsAndUI(focusedIndex = null) {
  while (orbitRingsGroup.children.length > 0)
    orbitRingsGroup.remove(orbitRingsGroup.children[0]);

  planets.forEach((planet, index) => {
    if (focusedIndex !== null && index !== focusedIndex) return;
    const dist = 800 + Math.pow(index, 2.2) * 300;
    const ecc = planet.eccentricity ? 1 + planet.eccentricity : 1.02;

    const curve = new THREE.EllipseCurve(
      0,
      0,
      dist * ecc,
      dist,
      0,
      2 * Math.PI,
      false,
      0,
    );
    const points = curve.getPoints(512);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: sceneSettings.orbitIntensity,
      blending: THREE.AdditiveBlending,
    });

    const orbitLine = new THREE.LineLoop(geometry, material);
    orbitLine.rotation.x = Math.PI / 2;
    if (planet.inclination)
      orbitLine.rotation.x += THREE.MathUtils.degToRad(planet.inclination);
    orbitRingsGroup.add(orbitLine);
  });
}

function focusOnTarget(mesh, data) {
  currentTarget = mesh;
  isZooming = true;
  infoCard.style.display = "block";
  planetNameLabel.innerText = data.name;
  planetDescLabel.innerText = data.description;

  // CRITICAL FIX: Initialize lastTargetPos immediately on click
  // This prevents the camera from "jumping" during the first frame
  mesh.getWorldPosition(lastTargetPos);

  const planetIdx = planets.findIndex((p) => p.name === data.name);
  updateOrbitsAndUI(planetIdx !== -1 ? planetIdx : null);

  moonListUI.innerHTML = "";
  if (data.moons && data.moons.length > 0) {
    moonSidebar.style.display = "block";
    data.moons.forEach((moon, idx) => {
      const li = document.createElement("li");
      li.className = "moon-item";
      li.innerText = moon.name;
      li.onclick = (e) => {
        e.stopPropagation();
        const pIndex = planets.findIndex((p) => p.name === data.name);
        focusOnTarget(planetMeshes[pIndex].moons[idx], moon);
      };
      moonListUI.appendChild(li);
    });
  } else {
    moonSidebar.style.display = "none";
  }
}
// --- INITIALIZE UI ---
const sunLi = document.createElement("li");
sunLi.className = "planet-item sun-item";
sunLi.innerHTML = `<strong>Sun</strong>`;
sunLi.onclick = () =>
  focusOnTarget(sun, {
    name: "The Sun",
    description: "The star at the center of the Solar System.",
    moons: [],
  });
planetListUI.appendChild(sunLi);

const closeBtn = document.getElementById("close-btn");

closeBtn.addEventListener("click", () => {
  // 1. Set currentTarget to null to stop the "Orbit Lock" math
  currentTarget = null;

  // 2. Stop the zooming state immediately
  isZooming = false;

  // 3. UI Cleanup
  infoCard.style.display = "none";
  moonSidebar.style.display = "none";

  // 4. Show all orbits again for a wide view
  updateOrbitsAndUI(null);

  // 5. Reset the last position so the next focus starts fresh
  lastTargetPos.set(0, 0, 0);
});

planets.forEach((planet, idx) => {
  const li = document.createElement("li");
  li.className = "planet-item";
  li.innerHTML = `<strong>${planet.name}</strong>`;
  li.onclick = () => focusOnTarget(planetMeshes[idx].mesh, planet);
  planetListUI.appendChild(li);
});

// --- ANIMATION LOOP ---
const rendererloop = () => {
  if (currentTarget) {
    currentTarget.getWorldPosition(targetPosition);

    // The Delta Glue: Moves camera/target by the planet's movement amount
    if (lastTargetPos.length() > 0) {
      const delta = new THREE.Vector3().subVectors(
        targetPosition,
        lastTargetPos,
      );
      camera.position.add(delta);
      controls.target.add(delta);
    }
  }

  // --- STANDARD MOVEMENTS (Rotation & Orbit) ---
  sun.rotation.y += 0.002 * sceneSettings.globalSpeed;
  if (asteroidBeltMesh)
    asteroidBeltMesh.rotation.y += 0.0005 * sceneSettings.globalSpeed;

  planetMeshes.forEach((planetObj) => {
    const planetData = planets[planetObj.index];
    const scaledSize = engine.getLogScale(planetData.radius);
    planetObj.mesh.scale.setScalar(scaledSize);

    if (planetObj.orbitAngle === undefined)
      planetObj.orbitAngle = Math.random() * Math.PI * 2;
    planetObj.orbitAngle +=
      engine.calculateSpeed(planetData, planetObj.index) *
      sceneSettings.globalSpeed;

    const newPos = engine.updatePosition(
      planetData,
      planetObj.orbitAngle,
      planetObj.index,
    );
    planetObj.mesh.position.copy(newPos);
    planetObj.mesh.rotation.y += 0.01 * sceneSettings.globalSpeed;

    planetObj.moons.forEach((moonMesh, mIdx) => {
      const moonData = planetData.moons[mIdx];
      moonMesh.scale.setScalar(0.25);
      if (!moonMesh.orbitAngle)
        moonMesh.orbitAngle = Math.random() * Math.PI * 2;
      moonMesh.orbitAngle += 0.02 * sceneSettings.globalSpeed;
      const mDist = scaledSize + moonData.distance * 0.05 + 2;
      moonMesh.position.set(
        Math.cos(moonMesh.orbitAngle) * mDist,
        0,
        Math.sin(moonMesh.orbitAngle) * mDist,
      );
    });
  });

  // --- ZOOM LOGIC ---
  if (currentTarget && isZooming) {
    const size = currentTarget.scale.x;
    const isMoon = currentTarget.parent !== scene && currentTarget !== sun;
    const idealDist = isMoon
      ? size * 6
      : size * (currentTarget === sun ? 3 : 5);

    const toCam = new THREE.Vector3().subVectors(
      camera.position,
      targetPosition,
    );
    const lerpedDist = THREE.MathUtils.lerp(toCam.length(), idealDist, 0.05);
    toCam.normalize().multiplyScalar(lerpedDist);
    camera.position.copy(targetPosition).add(toCam);

    // During zoom transition, keep the target perfectly centered
    controls.target.copy(targetPosition);

    if (Math.abs(toCam.length() - idealDist) < 0.1) {
      isZooming = false; // Transition over: Manual control is now free
    }
  }

  controls.update();
  composer.render();

  // Save for next frame
  if (currentTarget) {
    currentTarget.getWorldPosition(lastTargetPos);
  } else {
    lastTargetPos.set(0, 0, 0);
  }

  window.requestAnimationFrame(rendererloop);
};

async function initUniverse() {
  const loadingScreen = document.getElementById("loading-screen");

  // 1. Fetch data while the screen is showing
  const liveData = await getLivePlanetData();
  if (liveData) {
    planets.forEach((p) => {
      const live = liveData.find((d) => d.name === p.name);
      if (live) {
        p.eccentricity = live.eccentricity;
        p.inclination = live.inclination;
      }
    });
  }

  updateOrbitsAndUI();
  asteroidBeltMesh = addAsteroidBelt(scene, 4500, 6000);

  // 2. Wait for 3 seconds, then hide the screen and start the loop
  setTimeout(() => {
    loadingScreen.style.display = "none";
    rendererloop(); // Start the animation loop after 3s
  }, 500);
}
initUniverse();
