// orbit.js
import * as THREE from "three";

export class OrbitEngine {
  constructor() {
    // Increased from 100 to 800 to push Mercury far from the Sun
    this.distanceBase = 800;
    this.sizeScale = 8.0; // Larger planets for better detail when focused
  }

  getLogScale(radius) {
    return Math.log(radius + 1) * this.sizeScale;
  }

  // orbit.js updatePosition
  updatePosition(planetData, orbitAngle, index) {
    const dist = 800 + Math.pow(index, 2.2) * 300;
    const ecc = planetData.eccentricity ? 1 + planetData.eccentricity : 1.02;

    const x = Math.sin(orbitAngle) * (dist * ecc);
    const z = Math.cos(orbitAngle) * dist;
    const pos = new THREE.Vector3(x, 0, z);

    // Apply tilt to the position vector
    if (planetData.inclination) {
      const inclinationRad = THREE.MathUtils.degToRad(planetData.inclination);
      // Rotating around X-axis to match the orbitRing.rotation.x we set in main.js
      pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclinationRad);
    }
    return pos;
  }

  calculateSpeed(planetData, index) {
    const idx = index !== undefined ? index : 0;
    // Slowed down movement because at this scale, high speeds cause flickering
    return 0.02 / Math.pow(idx + 1, 0.7);
  }
}
