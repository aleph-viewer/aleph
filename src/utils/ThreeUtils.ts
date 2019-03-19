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
}
