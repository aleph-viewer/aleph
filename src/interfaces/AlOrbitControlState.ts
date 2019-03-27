export interface AlOrbitControlState {
  oldPosition: THREE.Vector3;
  controls: THREE.OrbitControls;
  targetPosition: THREE.Vector3;
  splashBackMesh: THREE.Mesh;
  splashBackGeom: THREE.PlaneGeometry;
  splashBackMaterial: THREE.MeshBasicMaterial;
  cameraPosition: THREE.Vector3;
  controlPosition: THREE.Vector3;
  animationStep: number;
}
