export class ThreeUtils {
  static worldToScreen(
    worldCoordinate: THREE.Vector3,
    camera: THREE.Camera,
    container
  ): THREE.Vector3 {
    const screenCoordinates = worldCoordinate.clone();
    screenCoordinates.project(camera);

    screenCoordinates.x = Math.round(
      ((screenCoordinates.x + 1) * container.offsetWidth) / 2
    );
    screenCoordinates.y = Math.round(
      ((-screenCoordinates.y + 1) * container.offsetHeight) / 2
    );
    screenCoordinates.z = 0;

    return screenCoordinates;
  }

  static vector3ToString(vec: THREE.Vector3): string {
    return vec.toArray().join(" ");
  }

  static stringToVector3(vec: string): THREE.Vector3 {
    let res = vec.split(" ");
    let vect = new THREE.Vector3();
    vect.x = Number(res[0]);
    vect.y = Number(res[1]);
    vect.z = Number(res[2]);

    return vect;
  }

  // TODO: Not Working! Need to Investigate
  // https://keithmaggio.wordpress.com/2011/02/15/math-magician-lerp-slerp-and-nlerp/
  static slerp(
    start: THREE.Vector3,
    end: THREE.Vector3,
    percent: number
  ): THREE.Vector3 {
    // Dot product - the cosine of the angle between 2 vectors.
    // Returns Degrees
    let dot: number = start.clone().dot(end.clone());

    // Clamp it to be in the range of Acos()
    // This may be unnecessary, but floating point
    // precision can be a fickle mistress.
    dot = THREE.Math.degToRad(dot);
    dot = Math.max(-1, Math.min(dot, 1));

    // Acos(dot) returns the angle between start and end,
    // And multiplying that by percent returns the angle between
    // start and the final result.
    let theta: number = Math.acos(dot) * percent;
    let relativeVector = new THREE.Vector3();
    relativeVector.copy(
      end
        .clone()
        .sub(start.clone())
        .multiplyScalar(dot)
    );
    relativeVector.normalize();

    // Orthonormal basis
    // The final result.
    let result = new THREE.Vector3();
    result.copy(
      start
        .clone()
        .multiplyScalar(Math.cos(theta))
        .add(relativeVector.clone().multiplyScalar(Math.sin(theta)))
    );
    return result;
  }
}
