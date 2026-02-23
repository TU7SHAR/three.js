import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
import "./style.css";

const pane = new Pane();
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const loader = new THREE.CubeTextureLoader().setPath(
  "./static/planets/cubemap_milkyway/",
);

// geometries only here
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);

// Load textures and FIX color space
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
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });

// planets (1/10)
const planets = [
  {
    name: "Mercury",
    radius: 0.38,
    distance: 140,
    speed: 0.02,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.95,
    distance: 180,
    speed: 0.015,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 240,
    speed: 0.01,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.27,
        distance: 4,
        speed: 0.03,
        material: moonMaterial,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.53,
    distance: 300,
    speed: 0.008,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 1.5,
        speed: 0.04,
        color: 0x8b5a2b,
      },
      {
        name: "Deimos",
        radius: 0.15,
        distance: 2.5,
        speed: 0.025,
        color: 0xaaaaaa,
      },
    ],
  },
  {
    name: "Jupiter",
    radius: 11.2,
    distance: 450,
    speed: 0.004,
    material: jupiterMaterial,
    moons: [
      { name: "Io", radius: 0.28, distance: 15, speed: 0.05, color: 0xffff99 },
      {
        name: "Europa",
        radius: 0.24,
        distance: 20,
        speed: 0.035,
        color: 0xdddddd,
      },
      {
        name: "Ganymede",
        radius: 0.41,
        distance: 26,
        speed: 0.025,
        color: 0xaa9988,
      },
      {
        name: "Callisto",
        radius: 0.38,
        distance: 32,
        speed: 0.015,
        color: 0x666666,
      },
    ],
  },
  {
    name: "Saturn",
    radius: 9.4,
    distance: 600,
    speed: 0.003,
    material: saturnMaterial,
    moons: [
      {
        name: "Titan",
        radius: 0.4,
        distance: 20,
        speed: 0.025,
        color: 0xffaa00,
      },
      {
        name: "Enceladus",
        radius: 0.15,
        distance: 14,
        speed: 0.04,
        color: 0xffffff,
      },
    ],
  },
  {
    name: "Uranus",
    radius: 4.0,
    distance: 800,
    speed: 0.002,
    material: uranusMaterial,
    moons: [],
  },
  {
    name: "Neptune",
    radius: 3.8,
    distance: 1000,
    speed: 0.001,
    material: neptuneMaterial,
    moons: [],
  },
];

const sceneSettings = {
  sunScale: 11.9, // sun's size
  planetSizeScale: 1,
  distanceScale: 0.24,
  globalSpeed: 0.8,
  zoom: 1,
};

const ScenePane = pane.addFolder({
  title: "SceneSettings",
  expanded: true,
});

ScenePane.addBinding(sceneSettings, "sunScale", {
  min: 1,
  max: 109,
  label: "Sun Size",
});
ScenePane.addBinding(sceneSettings, "planetSizeScale", {
  min: 0.01,
  max: 2,
  label: "Planet Size",
});
ScenePane.addBinding(sceneSettings, "distanceScale", {
  min: 0.01,
  max: 1,
  label: "Orbit Distance",
});
ScenePane.addBinding(sceneSettings, "globalSpeed", {
  min: 0,
  max: 2,
  label: "Time Speed",
});
ScenePane.addBinding(sceneSettings, "zoom", {
  min: 0.1,
  max: 10,
  step: 0.2,
  label: "Magnification",
}).on("change", (event) => {
  camera.zoom = event.value;
  camera.updateProjectionMatrix();
});

//Meshes called here
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
const pointLight = new THREE.PointLight(0xffffff, 30000);

// scenes here only
scene.add(sun, ambientLight, pointLight);
const planetMeshes = planets.map((planet) => {
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
  scene.add(planetMesh);

  const moonMeshes = planet.moons.map((moon) => {
    const moonMat =
      moon.material ||
      new THREE.MeshStandardMaterial({ color: moon.color || 0xffffff });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMat);
    planetMesh.add(moonMesh);
    return moonMesh;
  });

  return { mesh: planetMesh, moons: moonMeshes };
});

// tempo helper
// const axesHelper = new THREE.AxesHelper(50);
// scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000,
);
camera.position.z = 30;
camera.position.y = 15;

// operations
sun.scale.setScalar(10.9);

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

const rendererloop = () => {
  sun.scale.setScalar(sceneSettings.sunScale);

  planetMeshes.forEach((planetObj, planetIndex) => {
    const planetData = planets[planetIndex];

    planetObj.mesh.scale.setScalar(
      planetData.radius * sceneSettings.planetSizeScale,
    );

    planetObj.mesh.rotation.y += planetData.speed * sceneSettings.globalSpeed;
    const currentPlanetDistance =
      planetData.distance * sceneSettings.distanceScale;

    planetObj.mesh.position.x =
      Math.sin(planetObj.mesh.rotation.y) * currentPlanetDistance;
    planetObj.mesh.position.z =
      Math.cos(planetObj.mesh.rotation.y) * currentPlanetDistance;

    planetObj.moons.forEach((moonMesh, moonIndex) => {
      const moonData = planetData.moons[moonIndex];

      moonMesh.scale.setScalar(moonData.radius / planetData.radius);

      const currentMoonDistance =
        (moonData.distance * sceneSettings.distanceScale) /
        (planetData.radius * sceneSettings.planetSizeScale);

      moonMesh.rotation.y += moonData.speed * sceneSettings.globalSpeed;
      moonMesh.position.x = Math.sin(moonMesh.rotation.y) * currentMoonDistance;
      moonMesh.position.z = Math.cos(moonMesh.rotation.y) * currentMoonDistance;
    });
  });

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(rendererloop);
};

rendererloop();
