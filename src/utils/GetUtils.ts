import { AlNodeSerial, AlCameraSerial, AlEdgeSerial } from "../interfaces";
import { Constants } from "../Constants";
import { Entity } from "aframe";
import { ThreeUtils } from ".";

export class GetUtils {
  static getFileExtension(file: string): string {
    return file.substring(file.lastIndexOf(".") + 1);
  }

  static getNodeWithHighestId(nodes: Map<string, AlNodeSerial>): number {
    if (nodes.size) {
      return Math.max.apply(
        Math,
        [...nodes].map(([nodeId]) => {
          return this.getNodeIdNumber(nodeId);
        })
      );
    }

    return -1;
  }

  static getEdgeWithHighestId(edges: Map<string, AlEdgeSerial>): number {
    if (edges.size) {
      return Math.max.apply(
        Math,
        [...edges].map(([edgeId]) => {
          return this.getNodeIdNumber(edgeId);
        })
      );
    }

    return -1;
  }

  static getNodeIdNumber(nodeId: string): number {
    return Number(nodeId.split("-")[1]);
  }

  static getNextNodeId(nodes: Map<string, AlNodeSerial>): string {
    return "node-" + Number(this.getNodeWithHighestId(nodes) + 1);
  }

  static getNextEdgeId(edges: Map<string, AlEdgeSerial>): string {
    return "edge-" + Number(this.getEdgeWithHighestId(edges) + 1);
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

  static getCameraStateFromEntity(entity: Entity): AlCameraSerial {
    const entityMap = entity.object3DMap;
    let entityMesh: THREE.Mesh = entityMap.mesh as THREE.Mesh;

    let sceneCenter: THREE.Vector3;
    let initialPosition: THREE.Vector3;
    let sceneDistance: number;

    if (entityMesh) {
      const geom = entityMesh.geometry;
      if (!geom.boundingSphere) {
        geom.computeBoundingSphere();
      }
      sceneCenter = entityMesh.position;
      sceneDistance =
        (Constants.zoomFactor * geom.boundingSphere.radius) /
        Math.tan((Constants.cameraValues.fov * Math.PI) / 180);

      initialPosition = new THREE.Vector3();
      initialPosition.copy(sceneCenter);
      initialPosition.z += sceneDistance;

      return {
        target: sceneCenter,
        position: initialPosition
      } as AlCameraSerial;
    }

    return null;
  }

  static getCameraStateFromNode(
    node: AlNodeSerial,
    radius: number
  ): AlCameraSerial | null {
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
    } as AlCameraSerial;
  }
}
