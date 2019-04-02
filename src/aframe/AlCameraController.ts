import { AframeRegistry, AframeComponent, AlCameraSerial } from "../interfaces";
import { Constants } from "../Constants";
import { CameraType } from "../enums/CameraType";

interface AlCameraControllerState {
  orthographic: THREE.OrthographicCamera;
  perspective: THREE.PerspectiveCamera;
}

interface AlCameraControllerObject extends AframeComponent {
  dependencies: string[];
  update(_oldData): void;
}

export class AlCameraController implements AframeRegistry {
  public static get Object(): AlCameraControllerObject {
    return {
      dependencies: ["camera"],

      schema: {
        cameraType: { type: "string", default: CameraType.PERSPECTIVE }
      },

      init() {
        let orthoCamera = new THREE.OrthographicCamera(
          Constants.cameraValues.left,
          Constants.cameraValues.right,
          Constants.cameraValues.top,
          Constants.cameraValues.bottom,
          Constants.cameraValues.near,
          Constants.cameraValues.far
        );

        let perspectiveCamera = new THREE.PerspectiveCamera(
          Constants.cameraValues.fov,
          Constants.cameraValues.near,
          Constants.cameraValues.far
        );

        this.state = {
          orthographic: orthoCamera,
          perspective: perspectiveCamera
        } as AlCameraControllerState;

        if (this.data.camera === CameraType.ORTHOGRAPHIC) {
          this.el.sceneEl.camera = this.state.orthographic;
        } else if (this.data.camera === CameraType.PERSPECTIVE) {
          this.el.sceneEl.camera = this.state.perspective;
        } else {
          this.el.sceneEl.camera = this.state.perspective;
        }
      },

      update(_oldData) {
        if (this.data.camera === CameraType.ORTHOGRAPHIC) {
          this.el.sceneEl.camera = this.state.orthographic;
        } else if (this.data.camera === CameraType.PERSPECTIVE) {
          this.el.sceneEl.camera = this.state.perspective;
        } else {
          this.el.sceneEl.camera = this.state.perspective;
        }
        this.el.sceneEl.emit(AlCameraControllerEvents.UPDATED, {}, false);
      }
    } as AlCameraControllerObject;
  }

  public static get Tag(): string {
    return "al-camera-controller";
  }
}

export class AlCameraControllerEvents {
  static UPDATED: string = "al-camera-controller-updated";
}
