import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../Constants";
import { ControlsType } from "../../enums";

interface AlLookToCameraComponent extends BaseComponent {
  tickFunction(): void;
}

export default AFRAME.registerComponent("al-look-to-camera", {
  schema: {
    controlsType: { type: "string", default: ControlsType.ORBIT }
  },

  init() {
    this.bindMethods();
    this.addEventListeners();
    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      Constants.minFrameMS,
      this
    );
  },

  // tslint:disable-next-line: no-empty
  bindMethods(): void {},

  // tslint:disable-next-line: no-empty
  addEventListeners(): void {},

  // tslint:disable-next-line: no-empty
  removeEventListeners(): void {},

  // tslint:disable-next-line: no-any
  update(oldData: any): void {
    // Reset the up vector if we change camera mode
    if (this.data.isTrackball !== oldData.isTrackball) {
      (this.el.object3D as THREE.Object3D).up.copy(
        this.el.sceneEl.camera.up.clone()
      );
    }
  },

  tickFunction() {
    // Copy to up vector to make sure it stays upright
    // TODO: Add check for VR mode to prevent this behaviour
    switch (this.data.controlsType) {
      case ControlsType.TRACKBALL: {
        this.el.object3D.lookAt(this.el.sceneEl.camera.position);
        (this.el.object3D as THREE.Object3D).up.copy(
          this.el.sceneEl.camera.up.clone()
        );
        break;
      }
      case ControlsType.ORBIT: {
        const pos: THREE.Vector3 = this.el.object3D.position;
        const cam: THREE.Vector3 = this.el.sceneEl.camera.position;

        const dot = new THREE.Vector3();
        dot.crossVectors(pos.clone(), cam.clone()).normalize();

        this.el.object3D.up.copy(dot);
        this.el.object3D.lookAt(cam);
        (this.el.object3D as THREE.Object3D).rotateZ(Math.PI / 2);
        break;
      }
      default: {
        this.el.object3D.lookAt(this.el.sceneEl.camera.position);
        break;
      }
    }
  },

  tick() {
    this.tickFunction();
  },

  remove(): void {
    this.removeEventListeners();
  }
} as AlLookToCameraComponent);
