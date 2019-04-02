import { AframeRegistry, AframeComponent, AlCameraSerial } from "../interfaces";
import { Constants } from "../Constants";
import { ThreeUtils } from "../utils";
import { AlNodeSpawnerEvents, AlNodeEvents } from ".";
import { OrthographicCamera } from "three";

interface AlOrbitControlState {
  orthographic: THREE.OrthographicCamera;
  perspective: THREE.PerspectiveCamera;
}

interface AlCameraControllerObject extends AframeComponent {
  dependencies: string[];
  update(_oldData): void;
}

export class AlCameraController implements AframeRegistry {
  public static getObject(): AlCameraControllerObject {
    return {
      dependencies: ["camera"],

      schema: {
        camera: { type: "string", default: "perspective" }
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
        };

        if (this.data.camera === AlCameraTypes.ORTHOGRAPHIC) {
          this.el.sceneEl.camera = this.state.orthographic;
        } else if (this.data.camera === AlCameraTypes.PERSPECTIVE) {
          this.el.sceneEl.camera = this.state.perspective;
        } else {
          this.el.sceneEl.camera = this.state.perspective;
        }
      },

      update(_oldData) {
        if (this.data.camera === AlCameraTypes.ORTHOGRAPHIC) {
          this.el.sceneEl.camera = this.state.orthographic;
        } else if (this.data.camera === AlCameraTypes.PERSPECTIVE) {
          this.el.sceneEl.camera = this.state.perspective;
        } else {
          this.el.sceneEl.camera = this.state.perspective;
        }
        this.el.sceneEl.emit(AlCameraControllerEvents.UPDATED, {}, false);
      }
    } as AlCameraControllerObject;
  }

  public static getName(): string {
    return "al-camera-controller";
  }
}

export class AlCameraControllerEvents {
  static UPDATED: string = "al-camera-controller-updated";
}

export class AlCameraTypes {
  static ORTHOGRAPHIC: string = "orthographic";
  static PERSPECTIVE: string = "perspective";
}
