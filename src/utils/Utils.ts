import { Mesh } from "three";
import { ThreeUtils } from ".";
import { Constants } from "../Constants";
import { AlCamera, AlNode } from "../interfaces";

export class Utils {
  public static cssUnits: string[] = [
    "%",
    "ch",
    "cm",
    "em",
    "ex",
    "in",
    "mm",
    "pc",
    "pt",
    "px",
    "rem",
    "vh",
    "vmax",
    "vmin",
    "vw"
  ];

  public static addCssUnits(d: string): string {
    if (
      !this.cssUnits.some(u => {
        return d.includes(u);
      })
    ) {
      d += "px"; // default to px
    }
    return d;
  }

  public static getFileExtension(file: string): string {
    return file.substring(file.lastIndexOf(".") + 1);
  }

  public static getFileEndCharacters(file: string, n: number): string {
    return file.slice(file.length - n);
  }

  public static getGeometryCenter(
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

  public static getCameraStateFromMesh(mesh: Mesh): AlCamera {
    let meshCenter: THREE.Vector3;
    let initialPosition: THREE.Vector3;
    let sceneDistance: number;

    if (mesh) {
      const geom = mesh.geometry;
      meshCenter = this.getGeometryCenter(geom);
      sceneDistance =
        (Constants.zoomFactor * geom.boundingSphere.radius) /
        Math.tan((Constants.camera.fov * Math.PI) / 180);

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

  public static getCameraPositionFromNode(
    node: AlNode,
    radius: number,
    cameraTarget: THREE.Vector3
  ): THREE.Vector3 {
    if (!node) {
      return null;
    }

    const pos: THREE.Vector3 = new THREE.Vector3();
    pos.copy(ThreeUtils.stringToVector3(node.position));

    // (Position -> Target)
    const dir: THREE.Vector3 = pos
      .clone()
      .sub(cameraTarget.clone())
      .normalize();
    const camPos = new THREE.Vector3();
    camPos.copy(pos);

    // Add {defaultZoom} intervals of dir to camPos
    camPos.add(dir.clone().multiplyScalar(radius * Constants.zoomFactor));

    return camPos;
  }

  public static getBoundingBox(obj: THREE.Object3D): THREE.Box3 {
    return new THREE.Box3().setFromObject(obj);
  }

  public static normalise(num: number, min: number, max: number): number {
    return (num - min) / (max - min);
  }

  public static reverseNumber(num: number, min: number, max: number): number {
    return max + min - num;
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

  // public static getFontWidth(
  //   canvasWidth: number,
  //   boundingRadius: number,
  //   fontSize: number
  // ): number {
  //   const mult = canvasWidth * boundingRadius;
  //   const div = canvasWidth / boundingRadius;
  //   const ratio = mult / div;

  //   const logged = Math.log2(ratio);
  //   const abs = Math.abs(logged);
  //   const modded = (abs % 2) % 1;
  //   const final =
  //     (modded + 1) * fontSize * (boundingRadius * 0.5) * (1 / canvasWidth);

  //   return final;
  // }
}
