export interface AlOrbitControlState {
  oldPosition: THREE.Vector3;
  controls: THREE.OrbitControls;
  target: THREE.Vector3;
  splashBackMesh: THREE.Mesh;
  splashBackGeom: THREE.PlaneGeometry;
  splashBackMaterial: THREE.MeshBasicMaterial;
  inPosition: THREE.Vector3;
  animating: boolean;
  animationStart: THREE.Vector3;
  animationStep: number;
}
