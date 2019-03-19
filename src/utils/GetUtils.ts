import { Tool } from "../interfaces/Tool";

export class GetUtils {

  static getRandomPosition(): THREE.Vector3 {
    const cubeDistributionWidth: number = 20;
    const x: number = Math.random() * cubeDistributionWidth - cubeDistributionWidth / 2;
    const y: number = Math.random() * cubeDistributionWidth - cubeDistributionWidth / 2;
    const z: number = Math.random() * cubeDistributionWidth - cubeDistributionWidth;

    return new THREE.Vector3(x, y, z);
  }

  static getRandomColor(): string {
    return "#" + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
  }

  static getToolWithHighestId(tools: Tool[]): number {
    if (tools.length) {
      return Math.max.apply(Math, tools.map((tool) => { return tool.id; }))
    }

    return -1;
  }

  static getToolIndex(id: number, tools: Tool[]): number {
    return tools.findIndex((tool: Tool) => {
      return tool.id === id;
    });
  }

  static getGeometryCenter(geometry: THREE.Geometry | THREE.BufferGeometry): THREE.Vector3 {
    let geom: THREE.Geometry | THREE.BufferGeometry;
    if (geometry instanceof THREE.BufferGeometry) {
      geom = new THREE.Geometry().fromBufferGeometry(geometry);
    } else {
      geom = geometry;
    }
    geom.computeBoundingSphere();
    return geom.boundingSphere.center;
  }

  static getCameraPosition(geometry: THREE.Geometry | THREE.BufferGeometry, camera: THREE.PerspectiveCamera): THREE.Vector3 {
    geometry.computeBoundingBox();
    const sizeX: number = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    const sizeY: number = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
    const sizeZ: number = geometry.boundingBox.max.z - geometry.boundingBox.min.z;
    const maxDim: number = Math.max(Math.max(sizeX, sizeY), sizeZ);
    const distance: number = (2 * maxDim) / Math.tan((camera.fov * Math.PI) / 180);

    const sceneCenter: THREE.Vector3 = GetUtils.getGeometryCenter(geometry);

    const position: THREE.Vector3 = new THREE.Vector3(
      sceneCenter.x,
      sceneCenter.y,
      sceneCenter.z + distance
    );

    return position;
  }
}
