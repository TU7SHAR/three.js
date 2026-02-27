import * as THREE from "three";

export function initComet(scene) {
  const focalDistance = 2000;
  const centerX = focalDistance / 2;
  const a = 1500;
  const c = centerX;
  const b = Math.sqrt(a * a - c * c);

  const cometCurve = new THREE.EllipseCurve(
    centerX,
    0,
    a,
    b,
    0,
    2 * Math.PI,
    false,
    0,
  );
  const cometPoints = cometCurve.getPoints(256);
  const cometGeo = new THREE.BufferGeometry().setFromPoints(cometPoints);
  const cometOrbitMat = new THREE.LineBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.3,
  });
  const cometOrbitLine = new THREE.LineLoop(cometGeo, cometOrbitMat);
  cometOrbitLine.rotation.x = Math.PI / 2;
  scene.add(cometOrbitLine);

  const cometGeometry = new THREE.SphereGeometry(5, 64, 16);
  const cometMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc00,
    emissive: 0xffaa00,
    emissiveIntensity: 5,
  });
  const cometMesh = new THREE.Mesh(cometGeometry, cometMaterial);
  cometMesh.name = "Comet";
  scene.add(cometMesh);

  return { mesh: cometMesh, orbitLine: cometOrbitLine, angle: 0 };
}
