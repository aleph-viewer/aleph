export interface AlOrbitControlState {
  oldPosition: THREE.Vector3;
  controls: THREE.OrbitControls;
  target: THREE.Vector3;
  splashBackMesh: THREE.Mesh;
  splashBackGeom: THREE.PlaneGeometry;
  splashBackMaterial: THREE.MeshBasicMaterial;
  startPosition: THREE.Vector3;
}
