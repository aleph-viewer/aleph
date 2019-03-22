import { Tool } from "../interfaces/Tool";
import { Constants } from "../Constants";
import { Entity } from "aframe";

export class GetUtils {
  static getFileExtension(file: string): string {
    return file.substring(file.lastIndexOf(".") + 1);
  }

  static getRandomPosition(): THREE.Vector3 {
    const cubeDistributionWidth: number = 20;
    const x: number =
      Math.random() * cubeDistributionWidth - cubeDistributionWidth / 2;
    const y: number =
      Math.random() * cubeDistributionWidth - cubeDistributionWidth / 2;
    const z: number =
      Math.random() * cubeDistributionWidth - cubeDistributionWidth;

    return new THREE.Vector3(x, y, z);
  }

  static getRandomColor(): string {
    return (
      "#" +
      (
        "000000" +
        Math.random()
          .toString(16)
          .slice(2, 8)
          .toUpperCase()
      ).slice(-6)
    );
  }

  static getToolWithHighestId(tools: Tool[]): number {
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

  static getNextToolId(tools: Tool[]): string {
    return "tool-" + Number(this.getToolWithHighestId(tools) + 1);
  }

  static getToolIndex(id: string, tools: Tool[]): number {
    return tools.findIndex((tool: Tool) => {
      return this.getToolIdNumber(tool.id) === this.getToolIdNumber(id);
    });
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

  static getOrbitData(
    entity: Entity
  ): { sceneCenter: THREE.Vector3; initialPosition: THREE.Vector3 } {
    const entityMap = entity.object3DMap;
    let entityMesh: THREE.Mesh = entityMap.mesh as THREE.Mesh;

    let sceneCenter: THREE.Vector3;
    let initialPosition: THREE.Vector3;
    let sceneDistance: number;

    if (entityMesh) {
      if (!entityMesh.geometry.boundingSphere) {
        entityMesh.geometry.computeBoundingSphere();
      }
      sceneCenter = entityMesh.position;
      sceneDistance =
        (2.5 * entityMesh.geometry.boundingSphere.radius) /
        Math.tan((Constants.cameraValues.fov * Math.PI) / 180);

      initialPosition = new THREE.Vector3();
      initialPosition.copy(sceneCenter);
      initialPosition.z += sceneDistance;

      return { sceneCenter, initialPosition };
    } else {
      console.warn(
        "No mesh object found in object map!: " + entity.object3DMap
      );
    }
  }
}
