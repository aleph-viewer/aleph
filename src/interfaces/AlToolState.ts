export interface AlToolState {
  selected: boolean;
  hovered: boolean;
  geometry: THREE.SphereGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  camera: THREE.Camera;
  target: THREE.Vector3;
  dragging: boolean;
  mouseDown: boolean;
  text: string;
  textOffset: THREE.Vector3;
}
