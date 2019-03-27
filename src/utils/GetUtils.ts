import { AlToolSerial, AlCameraSerial } from "../interfaces";
import { Constants } from "../Constants";
import { Entity } from "aframe";
import { ThreeUtils } from ".";

export class GetUtils {
  static getFileExtension(file: string): string {
    return file.substring(file.lastIndexOf(".") + 1);
  }

  static getToolWithHighestId(tools: AlToolSerial[]): number {
    if (tools.length) {
      return Math.max.apply(
        Math,
        tools.map(tool => {
          return this.getToolIdNumber(tool.id);
        })
      );
    }

    return -1;
  }

  static getToolIdNumber(toolId: string): number {
    return Number(toolId.split("-")[1]);
  }

  static getNextToolId(tools: AlToolSerial[]): string {
    return "tool-" + Number(this.getToolWithHighestId(tools) + 1);
  }

  static getToolIndex(id: string, tools: AlToolSerial[]): number {
    return tools.findIndex((tool: AlToolSerial) => {
      return this.getToolIdNumber(tool.id) === this.getToolIdNumber(id);
    });
  }

  static getToolById(id: string, tools: AlToolSerial[]): AlToolSerial | null {
    let tool: AlToolSerial | null = null;

    tool = tools.find((tool: AlToolSerial) => {
      return tool.id === id;
    });

    return tool;
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

  static getCameraStateFromTool(
    tool: AlToolSerial,
    radius: number
  ): AlCameraSerial {
    let targ = new THREE.Vector3();
    targ.copy(ThreeUtils.stringToVector3(tool.target));

    let pos = new THREE.Vector3();
    pos.copy(ThreeUtils.stringToVector3(tool.position));

    // (Position -> Target)
    let dir = pos
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
