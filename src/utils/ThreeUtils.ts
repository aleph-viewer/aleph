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

  // https://en.wikipedia.org/wiki/Slerp
  static slerp(
    start: THREE.Vector3,
    end: THREE.Vector3,
    percent: number
  ): THREE.Vector3 | null {
    const t = percent;
    const p0 = start;
    const p1 = end;
    let theta = p0.angleTo(p1);
    if (theta) {
      theta = THREE.Math.clamp(theta, -0.99, 0.99);

      const topP0 = Math.sin(1 - t) * theta;
      const topP1 = Math.sin(t * theta);
      const bot = Math.sin(theta);

      const p0Const = topP0 / bot;
      const p1Const = topP1 / bot;

      const left = p0.clone().multiplyScalar(p0Const);
      const right = p1.clone().multiplyScalar(p1Const);
      const result = left.add(right);

      return result;
    } else {
      return null;
    }
  }
}
