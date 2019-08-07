import { Constants } from "../../Constants";
import { BaseComponent } from "./BaseComponent";

interface AlLookToCameraComponent extends BaseComponent {
  tickFunction(): void;
}

export default AFRAME.registerComponent("al-look-to-camera", {
  schema: {},

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

  tickFunction() {
    this.el.object3D.lookAt(this.el.sceneEl.camera.position);
  },

  tick() {
    this.tickFunction();
  },

  remove(): void {
    this.removeEventListeners();
  }
} as AlLookToCameraComponent);
