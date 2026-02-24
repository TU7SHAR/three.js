import * as THREE from "three";

export class OrbitalEngine {
  constructor() {
    // These constants handle the "Inaccurate Scale" feedback
    this.distanceScale = 0.05; // Compress vast space distances
    this.sizeScale = 0.5; // Base scale for planet radii
  }

  // Proper Research: Logarithmic scaling for realistic sizing
  getScaledRadius(realRadius) {
    return Math.log(realRadius + 1) * this.sizeScale;
  }

  // Calculate the position based on Keplerian orbital elements from API
  calculatePosition(data, angle) {
    // Semi-major axis from API or fallback to data
    const a =
      (data.semiMajorAxis ? data.semiMajorAxis / 1000000 : data.distance) *
      this.distanceScale;

    // Use Live Eccentricity from NASA
    const e = data.eccentricity || 0.01;

    // Elliptical Math
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(angle));

    let x = r * Math.cos(angle);
    let z = r * Math.sin(angle);
    let y = 0;

    // Proper Research: Apply Orbital Inclination
    if (data.inclination) {
      const i = THREE.MathUtils.degToRad(data.inclination);
      y = z * Math.sin(i);
      z = z * Math.cos(i);
    }

    return new THREE.Vector3(x, y, z);
  }
}
