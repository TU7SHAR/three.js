// miscObject.js
import * as THREE from "three";

export function addAsteroidBelt(scene) {
  const asteroidCount = 2000;
  const geometry = new THREE.IcosahedronGeometry(0.2, 0); // Double the base size
  const material = new THREE.MeshLambertMaterial({
    color: 0x888888,
    emissive: 0x222222, // Adds a tiny bit of "fake" light so they aren't pitch black
  });

  const instancedMesh = new THREE.InstancedMesh(
    geometry,
    material,
    asteroidCount,
  );
  const matrix = new THREE.Matrix4();

  for (let i = 0; i < asteroidCount; i++) {
    const radius = 35 + Math.random() * 20; // Ensure this is AFTER Mars but BEFORE Jupiter
    const angle = Math.random() * Math.PI * 2;

    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 2;
    const z = Math.sin(angle) * radius;

    // Increased scale range
    const scale = Math.random() * 0.8 + 0.2;

    matrix.makeRotationFromEuler(
      new THREE.Euler(Math.random(), Math.random(), Math.random()),
    );
    matrix.setPosition(x, y, z);
    matrix.scale(new THREE.Vector3(scale, scale, scale));

    instancedMesh.setMatrixAt(i, matrix);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
  scene.add(instancedMesh);
  return instancedMesh;
}
