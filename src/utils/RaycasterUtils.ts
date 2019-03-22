export class RaycasterUtils {
  static castMeshRay(
    raycaster: THREE.Raycaster,
    targetObject: THREE.Object3D
  ): THREE.Vector3 {
    let intersects: THREE.Intersection[] = raycaster.intersectObjects(
      targetObject.children
    );

    if (intersects.length <= 0) {
      return null;
    }

    return intersects[0].point;
  }
}
