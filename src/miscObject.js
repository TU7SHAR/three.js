import * as THREE from "three";

export function addAsteroidBelt(scene, innerRadius, outerRadius) {
  const asteroidCount = 3500;
  const geometry = new THREE.IcosahedronGeometry(1.2, 0);
  const material = new THREE.MeshStandardMaterial({
    color: 0x888888,
    emissive: 0x333333,
    roughness: 0.9,
  });

  const instancedMesh = new THREE.InstancedMesh(
    geometry,
    material,
    asteroidCount,
  );
  const matrix = new THREE.Matrix4();

  for (let i = 0; i < asteroidCount; i++) {
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const angle = Math.random() * Math.PI * 2;

    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 15;
    const z = Math.sin(angle) * radius;

    const scale = Math.random() * 3.5 + 1.5;

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
