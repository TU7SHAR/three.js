import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import "./style.css";

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

const textureLoader = new THREE.TextureLoader();
const loader = new THREE.CubeTextureLoader().setPath(
  "./static/planets/cubemap_milkyway/",
);

// geometries only here
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);

// textures here!!
const sunTexture = textureLoader.load("./static/planets/sun.jpg");
sunTexture.colorSpace = THREE.SRGBColorSpace;

const mercuryTexture = textureLoader.load("./static/planets/mercury.jpg");
mercuryTexture.colorSpace = THREE.SRGBColorSpace;

const venusTexture = textureLoader.load("./static/planets/venus.jpg");
venusTexture.colorSpace = THREE.SRGBColorSpace;

const earthTexture = textureLoader.load("./static/planets/earth.jpg");
earthTexture.colorSpace = THREE.SRGBColorSpace;

const marsTexture = textureLoader.load("./static/planets/mars.jpg");
marsTexture.colorSpace = THREE.SRGBColorSpace;

const jupiterTexture = textureLoader.load("./static/planets/jupiter.jpg");
jupiterTexture.colorSpace = THREE.SRGBColorSpace;

const saturnTexture = textureLoader.load("./static/planets/saturn.jpg");
saturnTexture.colorSpace = THREE.SRGBColorSpace;

const uranusTexture = textureLoader.load("./static/planets/uranus.jpg");
uranusTexture.colorSpace = THREE.SRGBColorSpace;

const neptuneTexture = textureLoader.load("./static/planets/neptune.jpg");
neptuneTexture.colorSpace = THREE.SRGBColorSpace;

const moonTexture = textureLoader.load("./static/planets/moon.jpg");
moonTexture.colorSpace = THREE.SRGBColorSpace;

const bgMap = await loader.loadAsync([
  "px.png",
  "nx.png",
  "py.png",
  "ny.png",
  "pz.png",
  "nz.png",
]);
scene.background = bgMap;

// material only here

const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture,
});
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const jupiterMaterial = new THREE.MeshStandardMaterial({
  map: jupiterTexture,
});
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
const neptuneMaterial = new THREE.MeshStandardMaterial({
  map: neptuneTexture,
});
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });

// planets (1/10)
const planets = [
  {
    name: "Mercury",
    radius: 0.8,
    distance: 60,
    speed: 0.02,
    material: mercuryMaterial,
    description:
      "The smallest planet and closest to the Sun. It has a cratered surface much like the Moon.",
    moons: [],
  },
  {
    name: "Venus",
    radius: 1.2,
    distance: 75,
    speed: 0.015,
    material: venusMaterial,
    description:
      "Often called Earth's twin, it has a thick, toxic atmosphere that traps heat in a runaway greenhouse effect.",
    moons: [],
  },
  {
    name: "Earth",
    radius: 1.5,
    distance: 95,
    speed: 0.01,
    material: earthMaterial,
    description:
      "Our home planet and the only world known to support life. 70% of its surface is covered in water.",
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 5,
        speed: 0.03,
        material: moonMaterial,
      },
    ],
  },
  {
    name: "Mars",
    radius: 1.0,
    distance: 125,
    speed: 0.008,
    material: marsMaterial,
    description:
      "The Red Planet. It is home to Olympus Mons, the largest volcano in the solar system.",
    moons: [
      {
        name: "Phobos",
        radius: 0.2,
        distance: 2,
        speed: 0.04,
        color: 0x8b5a2b,
      },
      {
        name: "Deimos",
        radius: 0.25,
        distance: 3,
        speed: 0.025,
        color: 0xaaaaaa,
      },
    ],
  },
  {
    name: "Jupiter",
    radius: 4.5,
    distance: 165,
    speed: 0.004,
    material: jupiterMaterial,
    description:
      "A massive gas giant more than twice as large as all other planets combined. It has a Great Red Spot storm.",
    moons: [
      { name: "Io", radius: 0.3, distance: 8, speed: 0.05, color: 0xffff99 },
      {
        name: "Europa",
        radius: 0.3,
        distance: 10,
        speed: 0.035,
        color: 0xdddddd,
      },
      {
        name: "Ganymede",
        radius: 0.4,
        distance: 13,
        speed: 0.025,
        color: 0xaa9988,
      },
      {
        name: "Callisto",
        radius: 0.4,
        distance: 16,
        speed: 0.015,
        color: 0x666666,
      },
    ],
  },
  {
    name: "Saturn",
    radius: 4.0,
    distance: 225,
    speed: 0.003,
    material: saturnMaterial,
    description:
      "Famous for its complex ring system, this gas giant is mostly composed of hydrogen and helium.",
    moons: [
      {
        name: "Titan",
        radius: 0.4,
        distance: 10,
        speed: 0.025,
        color: 0xffaa00,
      },
      {
        name: "Enceladus",
        radius: 0.2,
        distance: 7,
        speed: 0.04,
        color: 0xffffff,
      },
    ],
  },
  {
    name: "Uranus",
    radius: 2.5,
    distance: 255,
    speed: 0.002,
    material: uranusMaterial,
    description:
      "An ice giant with a unique tilt, causing it to rotate nearly on its side compared to other planets.",
    moons: [],
  },
  {
    name: "Neptune",
    radius: 2.4,
    distance: 295,
    speed: 0.001,
    material: neptuneMaterial,
    description:
      "The most distant major planet. It is dark, cold, and whipped by supersonic winds.",
    moons: [],
  },
];

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

//Meshes called here
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
const pointLight = new THREE.PointLight(0xffffff, 3000);

// scenes here only
clickables.push(sun);

currentTarget = sun;
currentTarget.getWorldPosition(previousTargetPosition);

scene.add(sun, ambientLight, pointLight);

const planetMeshes = planets.map((planet) => {
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
  scene.add(planetMesh);
  clickables.push(planetMesh);

  const moonMeshes = planet.moons.map((moon) => {
    const moonMat =
      moon.material ||
      new THREE.MeshStandardMaterial({ color: moon.color || 0xffffff });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMat);
    planetMesh.add(moonMesh);
    clickables.push(moonMesh);
    return moonMesh;
  });

  return { mesh: planetMesh, moons: moonMeshes };
});

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

window.addEventListener("dblclick", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickables);

  if (intersects.length > 0) {
    const clickedObj = intersects[0].object;

    if (currentTarget !== clickedObj) {
      currentTarget = clickedObj;
      isZooming = true;

      const planetData = planets.find(
        (p) => p.material === clickedObj.material,
      );

      if (planetData) {
        infoCard.style.display = "block";
        planetNameLabel.innerText = planetData.name;
        planetDescLabel.innerText = planetData.description;

        savedSpeed = sceneSettings.globalSpeed;
        sceneSettings.globalSpeed = 0;
        pane.refresh();
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

  currentTarget.getWorldPosition(targetPosition);
  const delta = new THREE.Vector3().subVectors(
    targetPosition,
    previousTargetPosition,
  );
  camera.position.add(delta);

  if (isZooming) {
    const objectSize = currentTarget.scale.x;
    const distanceMultiplier = currentTarget === sun ? 3 : 6;
    const idealDistance = objectSize * distanceMultiplier;
    const toCamera = new THREE.Vector3().subVectors(
      camera.position,
      targetPosition,
    );
    const currentDistance = toCamera.length();
    const newDistance = THREE.MathUtils.lerp(
      currentDistance,
      idealDistance,
      0.05,
    );

    toCamera.normalize().multiplyScalar(newDistance);
    camera.position.copy(targetPosition).add(toCamera);
    controls.target.lerp(targetPosition, 0.05);

    if (Math.abs(currentDistance - idealDistance) < objectSize * 0.1) {
      isZooming = false;
    }
  } else {
    controls.target.copy(targetPosition);
  }

  previousTargetPosition.copy(targetPosition);
  controls.update();

  composer.render();
  window.requestAnimationFrame(rendererloop);
};

rendererloop();
