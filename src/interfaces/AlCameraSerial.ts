import { CameraType } from "../enums/CameraType";

export interface AlCameraSerial {
  position: THREE.Vector3;
  target: THREE.Vector3;
  animating: boolean;
  type: CameraType;
}
