export interface AlToolState {
  selected: boolean;
  hovered: boolean;
  geometry: THREE.SphereGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  camera: THREE.Camera;
  focus: THREE.Object3D;
  moving: boolean;
}
