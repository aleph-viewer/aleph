import { AframeRegistryEntry } from "../../interfaces";
import { Constants } from "../../Constants";
import { ComponentDefinition } from "aframe";

interface AlLookToCameraDefinition extends ComponentDefinition {
  tickFunction(): void;
}

export class AlLookToCameraComponent implements AframeRegistryEntry {
  public static get Object(): AlLookToCameraDefinition {
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
    } as AlLookToCameraDefinition;
  }

  public static get Tag(): string {
    return "al-look-to-camera";
  }
}
