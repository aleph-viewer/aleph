import { AframeRegistry, AframeComponent } from "../interfaces";
import { ThreeUtils } from "../utils";
interface AlFixedToOrbitCameraState {
  distanceFromTarget: number;
  target: THREE.Vector3;
}

interface AlFixedToOrbitCameraObject extends AframeComponent {
  update(oldData): void;
  tick(): void;
}

export class AlFixedToOrbitCamera implements AframeRegistry {
  public static getObject(): AlFixedToOrbitCameraObject {
    return {
      schema: {
        distanceFromTarget: { type: "number", default: 0.1 },
        target: { type: "vec3" }
      },

      init(_data?: any) {
        if (this.data.target) {
          let targ = ThreeUtils.objectToVector3(this.data.target);

          this.state = {
            distanceFromTarget: this.data.distanceFromTarget,
            target: targ
          } as AlFixedToOrbitCameraState;
        } else {
          this.state = {
            distanceFromTarget: this.data.distanceFromTarget,
            target: new THREE.Vector3(0, 0, 0)
          } as AlFixedToOrbitCameraState;
        }
      },

      update(_oldData) {
        let targ = ThreeUtils.objectToVector3(this.data.target);

        this.state = {
          distanceFromTarget: this.data.distanceFromTarget,
          target: targ
        } as AlFixedToOrbitCameraState;
      },

      tick() {
        let el = this.el;
        let state = this.state;

        const camPos = el.sceneEl.camera.position;
        const dir = (state.target
          .clone()
          .sub(camPos.clone()) as THREE.Vector3).normalize();

        el.object3D.position.copy(dir.multiplyScalar(state.distanceFromTarget));
        el.object3D.lookAt(camPos);
      },
    } as AlFixedToOrbitCameraObject;
  }
  public static getName(): string {
    return "al-fixed-to-orbit-camera";
  }
}
