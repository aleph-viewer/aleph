export interface AlToolState {
  selected: boolean;
  hovered: boolean;
  geometry: THREE.SphereGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  raycaster: THREE.Raycaster;
  camera: THREE.Camera;
  focus: THREE.Object3D;
  maxRayDistance: number;
}
