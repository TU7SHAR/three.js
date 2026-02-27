import * as THREE from "three";

export class OrbitEngine {
  constructor() {
    this.distanceBase = 800;
    this.sizeScale = 8.0;
  }

  getLogScale(radius) {
    return Math.log(radius + 1) * this.sizeScale;
  }

  getOrbitParams(planetData, index) {
    let radius;
    const innerGap = 150;
    const outerGap = 800;
    const asteroidBeltJump = 1200;

    if (index <= 3) {
      radius = 400 + index * innerGap;
    } else {
      const marsEnd = 400 + 3 * innerGap;
      radius = marsEnd + asteroidBeltJump + (index - 4) * outerGap;
    }

    const ecc = planetData.eccentricity ? 1 + planetData.eccentricity : 1.02;
    return { radius, ecc };
  }
  getMoonPosition(moonData, orbitAngle) {
    const radius = moonData.distance * 0.5 + 10;
    const x = Math.cos(orbitAngle) * radius;
    const z = Math.sin(orbitAngle) * radius;

    return new THREE.Vector3(x, 0, z);
  }
  getCometPosition(orbitAngle) {
    const focalDistance = 2000;
    const centerX = focalDistance / 2;
    const a = 1500;
    const c = centerX;
    const b = Math.sqrt(a * a - c * c);

    const x = Math.cos(orbitAngle) * a + centerX;
    const z = Math.sin(orbitAngle) * b;

    return new THREE.Vector3(x, 0, z);
  }

  updatePosition(planetData, orbitAngle, index) {
    const { radius, ecc } = this.getOrbitParams(planetData, index);

    const x = Math.cos(orbitAngle) * (radius * ecc);
    const y = Math.sin(orbitAngle) * radius;
    const position = new THREE.Vector3(x, y, 0);

    if (planetData.inclination) {
      const inclinationRad = THREE.MathUtils.degToRad(planetData.inclination);
      position.applyAxisAngle(new THREE.Vector3(0, 0, 1), inclinationRad);
    }

    position.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

    return position;
  }

  calculateSpeed(planetData, index) {
    const idx = index !== undefined ? index : 0;
    return 0.02 / Math.pow(idx + 1, 0.7);
  }
}
