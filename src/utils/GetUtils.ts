import { AlNode, AlCamera } from "../interfaces";
import { Constants } from "../Constants";
import { ThreeUtils } from ".";
import { Mesh } from "three";

export class GetUtils {
  static getFileExtension(file: string): string {
    return file.substring(file.lastIndexOf(".") + 1);
  }

  static getGeometryCenter(
    geometry: THREE.Geometry | THREE.BufferGeometry
  ): THREE.Vector3 {
    let geom: THREE.Geometry | THREE.BufferGeometry;
    if (geometry instanceof THREE.BufferGeometry) {
      geom = new THREE.Geometry().fromBufferGeometry(geometry);
    } else {
      geom = geometry;
    }
    geom.computeBoundingSphere();
    return geom.boundingSphere.center;
  }

  static getCameraStateFromMesh(mesh: Mesh): AlCamera {
    let meshCenter: THREE.Vector3;
    let initialPosition: THREE.Vector3;
    let sceneDistance: number;

    if (mesh) {
      const geom = mesh.geometry;
      meshCenter = this.getGeometryCenter(geom);
      sceneDistance =
        (Constants.zoomFactor * geom.boundingSphere.radius) /
        Math.tan((Constants.cameraValues.fov * Math.PI) / 180);

      initialPosition = new THREE.Vector3();
      initialPosition.copy(meshCenter);
      initialPosition.z += sceneDistance;

      return {
        target: meshCenter,
        position: initialPosition
      } as AlCamera;
    }

    return null;
  }

  static getCameraStateFromNode(node: AlNode, radius: number): AlCamera | null {
    if (!node) {
      return null;
    }

    let targ: THREE.Vector3 = new THREE.Vector3();
    targ.copy(ThreeUtils.stringToVector3(node.target));

    let pos: THREE.Vector3 = new THREE.Vector3();
    pos.copy(ThreeUtils.stringToVector3(node.position));

    // (Position -> Target)
    let dir: THREE.Vector3 = pos
      .clone()
      .sub(targ.clone())
      .normalize();
    let camPos = new THREE.Vector3();
    camPos.copy(pos);

    // Add {defaultZoom} intervals of dir to camPos
    camPos.add(dir.clone().multiplyScalar(radius * Constants.zoomFactor));

    return {
      target: targ,
      position: camPos
    } as AlCamera;
  }

  static getBoundingBox(obj: THREE.Object3D): THREE.Box3 {
    return new THREE.Box3().setFromObject(obj);
  }

  /*
  static getArea(points: THREE.Vector3[]) {
    let area = 0;
    let j = points.length - 1; // the last vertex is the 'previous' one to the first

    for (let i = 0; i < points.length; i++) {
      area += (points[j].x + points[i].x) * (points[j].y - points[i].y);
      j = i; // j is the previous vertex to i
    }

    return Math.abs(area / 2);
  }
  */
}
