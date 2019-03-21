export class RaycasterUtils {
  static castMeshRay(
    raycaster: THREE.Raycaster,
    focusObject: THREE.Object3D
  ): THREE.Vector3 {
    let intersects: THREE.Intersection[] = raycaster.intersectObjects(
      focusObject.children
    );

    if (intersects.length <= 0) {
      return null;
    }

    return intersects[0].point;
  }
}
