import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
import "./style.css";

const pane = new Pane();
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

// geometries only here
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// textures implemented here
const sunTexture = textureLoader.load("/static/planets/sun.jpg");
const mercuryTexture = textureLoader.load("/static/planets/mercury.jpg");
const venusTexture = textureLoader.load("/static/planets/venus.jpg");
const earthTexture = textureLoader.load("/static/planets/earth.jpg");
const marsTexture = textureLoader.load("/static/planets/mars.jpg");
const jupiterTexture = textureLoader.load("/static/planets/jupiter.jpg");
const saturnTexture = textureLoader.load("/static/planets/saturn.jpg");
const uranusTexture = textureLoader.load("/static/planets/uranus.jpg");
const neptuneTexture = textureLoader.load("/static/planets/neptune.jpg");
const moonTexture = textureLoader.load("/static/planets/moon.jpg");

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

// planets
const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "moon",
        radius: 0.3,
        distance: 1.8,
        speed: 0.015,
        material: moonMaterial,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
        color: "blue",
        // materials: phobosMaterial,
      },
      {
        name: "deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
  {
    name: "Jupiter",
    radius: 0.5,
    distance: 30,
    speed: 0.0009,
    material: jupiterMaterial,
    moons: [],
  },
  {
    name: "Saturn",
    radius: 0.5,
    distance: 35,
    speed: 0.0006,
    material: saturnMaterial,
    moons: [],
  },
  {
    name: "Uranus",
    radius: 0.5,
    distance: 40,
    speed: 0.0003,
    material: uranusMaterial,
    moons: [],
  },
  {
    name: "Neptune",
    radius: 0.5,
    distance: 45,
    speed: 0.00009,
    material: neptuneMaterial,
    moons: [],
  },
];

//Meshes called here
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
const light = new THREE.AmbientLight("white", 1);

// scenes here only
scene.add(sun, light);
const planetMeshes = planets.map((planet) => {
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;

  scene.add(planetMesh);

  planet.moons.forEach((moon) => {
    const moonMat =
      moon.material ||
      new THREE.MeshStandardMaterial({
        color: moon.color || 0xffffff,
      });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMat);
    moonMesh.scale.setScalar(moon.radius);
    moonMesh.position.x = moon.distance;
    planetMesh.add(moonMesh);
  });
});

sun.add(planetMeshes);

// tempo helper
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
camera.position.z = 30;
camera.position.y = 5;

// operations
sun.scale.setScalar(5);

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

// initializing the clock
const clock = new THREE.Clock();

const rendererloop = () => {
  //   let time = clock.getElapsedTime();

  //   earth.rotation.y += THREE.MathUtils.degToRad(0.1);
  //   earth.position.x = Math.sin(time / 2) * 10;
  //   earth.position.z = Math.cos(time / 2) * 10;

  //   moon.position.x = Math.sin(time) * 2;
  //   moon.position.z = Math.cos(time) * 2;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(rendererloop);
};

rendererloop();
