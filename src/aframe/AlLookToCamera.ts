import { AframeRegistry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";

interface AlLookToCameraObject {
  tickFunction(): void;
  tick(): void;
}

export class AlLookToCamera implements AframeRegistry {
  public static get Object(): AlLookToCameraObject {
    return {
      schema: {},

      init() {
        this.tickFunction = AFRAME.utils.throttle(
          this.tickFunction,
          Constants.minFrameMS,
          this
        );
      },

      tickFunction() {
        this.el.object3D.lookAt(this.el.sceneEl.camera.position);
      },

      tick() {
        this.tickFunction();
      }
    } as AlLookToCameraObject;
  }

  public static get Tag(): string {
    return "al-look-to-camera";
  }
}
