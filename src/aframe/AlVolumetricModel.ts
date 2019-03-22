import { AframeComponent, AframeObject } from "../interfaces/interfaces";
import { VolumetricLoader } from "../utils/VolumetricLoader";

export class AlVolumetricModel implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      schema: {
        src: { type: "model", default: "" }
      },

      init(): void {
        this.model = null;
        this.loader = new VolumetricLoader();

        // todo: create lutcanvases container
        /*
        <div id="lut-container">
          <div id="lut-min">0.0</div>
          <div id="lut-canvases"></div>
          <div id="lut-max">1.0</div>
        </div>
        */
      },

      update(): void {
        //var self = this;
        var el = this.el;
        var src = this.data.src;

        if (!src) {
          return;
        }

        this.remove();

        this.loader.load(src, el).then(stack => {
          console.log("stack loaded", stack);
        });
      },

      tick(): void {},

      remove(): void {
        if (!this.model) {
          return;
        }
        this.el.removeObject3D("mesh");
      },

      pause(): void {},

      play(): void {},

      onEnterVR(): void {},

      onExitVR(): void {}
    } as AframeObject;
  }

  public static getName(): string {
    return "al-volumetric-model";
  }
}
