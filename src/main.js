import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { getLivePlanetData } from "./planetApi.js";
import { planets } from "./planet";
import { addAsteroidBelt } from "./miscObject";
import { sunMaterial, planetMaterials, bgMap } from "./material";
import { initComet } from "./comet.js";
import { OrbitEngine } from "./orbit.js";
import "./style.css";

const engine = new OrbitEngine();
const scene = new THREE.Scene();
scene.background = bgMap;

const mainPane = new Pane();
const cometPaneContainer = document.getElementById("comet-pane-container");
const cometPane = new Pane({
  container: cometPaneContainer,
  title: "Comet Controls",
});

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
  orbitIntensity: 0.1,
  showLabels: false,
};

const cometSettings = {
  cometSpeed: 3.9,
  orbitIntensity: 0.3,
  showComet: true,
};

const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.name = "Sun";
sun.scale.setScalar(30);
scene.add(sun);
clickables.push(sun);
currentTarget = sun;

const orbitRingsGroup = new THREE.Group();
scene.add(orbitRingsGroup);

const moonOrbitsGroup = new THREE.Group();
scene.add(moonOrbitsGroup);

const labelContainer = document.createElement("div");
labelContainer.id = "planet-labels";
document.body.appendChild(labelContainer);

const sunLi = document.createElement("li");
sunLi.className = "planet-item sun-item";
sunLi.innerHTML = `<strong>Sun</strong>`;
sunLi.onclick = () =>
  focusOnTarget(sun, {
    name: "Sun",
    description:
      "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma.",
  });
planetListUI.appendChild(sunLi);

const planetMeshes = planets.map((planet, index) => {
  const material = planetMaterials[planet.name];
  const planetMesh = new THREE.Mesh(sphereGeometry, material);
  scene.add(planetMesh);
  clickables.push(planetMesh);
  planetMesh.name = planet.name;

  const label = document.createElement("div");
  label.className = "planet-label";
  label.innerText = planet.name;
  labelContainer.appendChild(label);

  const li = document.createElement("li");
  li.className = "planet-item";
  li.innerHTML = `<strong>${planet.name}</strong>`;
  li.onclick = () => focusOnTarget(planetMesh, planet);
  planetListUI.appendChild(li);

  const moonMeshes = planet.moons.map((moon) => {
    const moonMat =
      planetMaterials[moon.name] ||
      new THREE.MeshStandardMaterial({ color: 0xffffff });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMat);
    planetMesh.add(moonMesh);
    clickables.push(moonMesh);
    return moonMesh;
  });

  return {
    mesh: planetMesh,
    moons: moonMeshes,
    index: index,
    labelElement: label,
  };
});

scene.add(new THREE.AmbientLight(0xffffff, 0.1));
const pointLight = new THREE.PointLight(0xffffff, 2000, 1000000);
pointLight.decay = 1;
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  20000000,
);
camera.position.set(0, 2000, 4000);

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  logarithmicDepthBuffer: true,
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

function createOrbitRings(focusedIndex = null) {
  while (orbitRingsGroup.children.length > 0)
    orbitRingsGroup.remove(orbitRingsGroup.children[0]);
  planets.forEach((planet, index) => {
    if (focusedIndex !== null && index !== focusedIndex) return;
    const { radius, ecc } = engine.getOrbitParams(planet, index);
    const curve = new THREE.EllipseCurve(
      0,
      0,
      radius * ecc,
      radius,
      0,
      2 * Math.PI,
      false,
      0,
    );
    const points = curve.getPoints(512);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const matrix = new THREE.Matrix4();
    if (planet.inclination) {
      matrix.makeRotationZ(THREE.MathUtils.degToRad(planet.inclination));
      geometry.applyMatrix4(matrix);
    }
    matrix.makeRotationX(Math.PI / 2);
    geometry.applyMatrix4(matrix);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: sceneSettings.orbitIntensity,
      blending: THREE.AdditiveBlending,
    });
    orbitRingsGroup.add(new THREE.LineLoop(geometry, material));
  });
}

function createMoonOrbits(planetData, planetMesh) {
  while (moonOrbitsGroup.children.length > 0) {
    const child = moonOrbitsGroup.children[0];
    if (child.parent) child.parent.remove(child);
    moonOrbitsGroup.remove(child);
  }
  if (!planetData.moons) return;
  planetData.moons.forEach((moon) => {
    const radius = moon.distance * 0.5 + 15;
    const curve = new THREE.EllipseCurve(
      0,
      0,
      radius,
      radius,
      0,
      2 * Math.PI,
      false,
      0,
    );
    const points = curve.getPoints(128);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const matrix = new THREE.Matrix4().makeRotationX(Math.PI / 2);
    geometry.applyMatrix4(matrix);
    const material = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const moonOrbit = new THREE.LineLoop(geometry, material);
    planetMesh.add(moonOrbit);
    moonOrbitsGroup.add(moonOrbit);
  });
}

function focusOnTarget(mesh, data) {
  currentTarget = mesh;
  isZooming = true;
  infoCard.style.display = "block";
  planetNameLabel.innerText = data.name;
  planetDescLabel.innerText = data.description;
  mesh.getWorldPosition(lastTargetPos);
  const planetIdx = planets.findIndex((p) => p.name === data.name);
  createOrbitRings(planetIdx !== -1 ? planetIdx : null);
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
    if (planetIdx !== -1) createMoonOrbits(data, mesh);
  } else {
    moonSidebar.style.display = "none";
    while (moonOrbitsGroup.children.length > 0)
      moonOrbitsGroup.remove(moonOrbitsGroup.children[0]);
  }
}

document.getElementById("close-btn").addEventListener("click", () => {
  currentTarget = null;
  isZooming = false;
  infoCard.style.display = "none";
  moonSidebar.style.display = "none";
  createOrbitRings(null);
  while (moonOrbitsGroup.children.length > 0) {
    const child = moonOrbitsGroup.children[0];
    if (child.parent) child.parent.remove(child);
    moonOrbitsGroup.remove(child);
  }
  lastTargetPos.set(0, 0, 0);
  controls.target.set(0, 0, 0);
});

const rendererloop = () => {
  if (currentTarget) {
    currentTarget.getWorldPosition(targetPosition);
    if (lastTargetPos.length() > 0) {
      const delta = new THREE.Vector3().subVectors(
        targetPosition,
        lastTargetPos,
      );
      camera.position.add(delta);
      controls.target.add(delta);
    }
  }

  sun.rotation.y += 0.002 * sceneSettings.globalSpeed;
  if (asteroidBeltMesh)
    asteroidBeltMesh.rotation.y += 0.0005 * sceneSettings.globalSpeed;

  if (window.sunLabelElement) {
    const sunV = new THREE.Vector3();
    sun.getWorldPosition(sunV);
    sunV.project(camera);
    const sx = (sunV.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (sunV.y * -0.5 + 0.5) * window.innerHeight;
    window.sunLabelElement.style.transform = `translate(-50%, -50%) translate(${sx}px, ${sy}px)`;
    window.sunLabelElement.style.display =
      sceneSettings.showLabels && sunV.z < 1 ? "block" : "none";
  }
  if (window.cometData && window.cometData.labelElement) {
    const shouldShow =
      sceneSettings.showLabels && cometSettings.showComet && vector.z < 1;
    window.cometData.labelElement.style.display = shouldShow ? "block" : "none";
  }
  if (window.cometData) {
    window.cometData.angle += 0.005 * cometSettings.cometSpeed;
    const pos = engine.getCometPosition(window.cometData.angle);
    window.cometData.mesh.position.copy(pos);
    window.cometData.mesh.rotation.y += 0.05;
    const cv = new THREE.Vector3();
    window.cometData.mesh.getWorldPosition(cv);
    cv.project(camera);
    const cx = (cv.x * 0.5 + 0.5) * window.innerWidth;
    const cy = (cv.y * -0.5 + 0.5) * window.innerHeight;
    if (window.cometData.labelElement) {
      window.cometData.labelElement.style.transform = `translate(-50%, -50%) translate(${cx}px, ${cy}px)`;
      window.cometData.labelElement.style.display =
        sceneSettings.showLabels && cv.z < 1 ? "block" : "none";
    }
  }

  planetMeshes.forEach((planetObj) => {
    const planetData = planets[planetObj.index];
    planetObj.mesh.scale.setScalar(engine.getLogScale(planetData.radius));
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

    const pv = new THREE.Vector3();
    planetObj.mesh.getWorldPosition(pv);
    pv.project(camera);
    const px = (pv.x * 0.5 + 0.5) * window.innerWidth;
    const py = (pv.y * -0.5 + 0.5) * window.innerHeight;
    planetObj.labelElement.style.transform = `translate(-50%, -50%) translate(${px}px, ${py}px)`;
    planetObj.labelElement.style.display =
      sceneSettings.showLabels && pv.z < 1 ? "block" : "none";

    planetObj.moons.forEach((moonMesh, mIdx) => {
      const moonData = planetData.moons[mIdx];
      moonMesh.scale.setScalar(0.25);
      if (!moonMesh.orbitAngle)
        moonMesh.orbitAngle = Math.random() * Math.PI * 2;
      moonMesh.orbitAngle += 0.02 * sceneSettings.globalSpeed;
      const mDist = planetObj.mesh.scale.x + moonData.distance * 0.1 + 5;
      moonMesh.position.set(
        Math.cos(moonMesh.orbitAngle) * mDist,
        0,
        Math.sin(moonMesh.orbitAngle) * mDist,
      );
    });
  });

  if (currentTarget && isZooming) {
    const size = currentTarget.scale.x;
    const idealDist = size * (currentTarget === sun ? 3 : 6);
    const toCam = new THREE.Vector3().subVectors(
      camera.position,
      targetPosition,
    );
    const lerpedDist = THREE.MathUtils.lerp(toCam.length(), idealDist, 0.05);
    toCam.normalize().multiplyScalar(lerpedDist);
    camera.position.copy(targetPosition).add(toCam);
    controls.target.copy(targetPosition);
    if (Math.abs(toCam.length() - idealDist) < 0.1) isZooming = false;
  }

  controls.update();
  composer.render();
  if (currentTarget) currentTarget.getWorldPosition(lastTargetPos);
  window.requestAnimationFrame(rendererloop);
};

const sceneFolder = mainPane.addFolder({
  title: "SceneSettings",
  expanded: true,
});
sceneFolder.addBinding(sceneSettings, "globalSpeed", {
  min: 0,
  max: 2,
  label: "Time Speed",
});
sceneFolder
  .addBinding(sceneSettings, "bloomPass", {
    min: 0,
    max: 5,
    label: "Sun Intensity",
  })
  .on("change", (e) => {
    bloomPass.strength = e.value;
  });
sceneFolder
  .addBinding(sceneSettings, "orbitIntensity", {
    min: 0,
    max: 1,
    label: "Orbit Intensity",
  })
  .on("change", (e) => {
    orbitRingsGroup.children.forEach((ring) => {
      if (ring.material) ring.material.opacity = e.value;
    });
  });
sceneFolder.addBinding(sceneSettings, "showLabels", { label: "Planet Labels" });

cometPane.addBinding(cometSettings, "cometSpeed", {
  min: 0,
  max: 10,
  label: "Comet Speed",
});
cometPane
  .addBinding(cometSettings, "orbitIntensity", {
    min: 0,
    max: 1,
    label: "Orbit Line",
  })
  .on("change", (e) => {
    if (window.cometData && window.cometData.orbitLine)
      window.cometData.orbitLine.material.opacity = e.value;
  });
cometPane
  .addBinding(cometSettings, "showComet", {
    label: "Show Comet",
  })
  .on("change", (e) => {
    if (window.cometData) {
      // Hide/Show the actual comet rock
      window.cometData.mesh.visible = e.value;

      window.cometData.orbitLine.visible = e.value;

      if (window.cometData.labelElement) {
        window.cometData.labelElement.style.visibility = e.value
          ? "visible"
          : "hidden";
      }
    }
  });

async function initUniverse() {
  window.cometData = initComet(scene);
  const sunLabel = document.createElement("div");
  sunLabel.className = "planet-label";
  sunLabel.innerText = "Sun";
  labelContainer.appendChild(sunLabel);
  window.sunLabelElement = sunLabel;

  const loadingScreen = document.getElementById("loading-screen");
  try {
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
  } catch (err) {
    console.error(err);
  }
  createOrbitRings();
  asteroidBeltMesh = addAsteroidBelt(scene, 1200, 1700);
  setTimeout(() => {
    if (loadingScreen) loadingScreen.style.display = "none";
    rendererloop();
  }, 1000);
}

initUniverse();
