import { AframeRegistry, AframeComponent } from "../interfaces";
import { VolumetricLoader } from "../utils/VolumetricLoader";

interface AlVolumetricModelObject extends AframeComponent {
  update(): void;
  remove(): void;
}

export class AlVolumetricModel implements AframeRegistry {
  public static get Object(): AlVolumetricModelObject {
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
        //let  self = this;
        let el = this.el;
        let src = this.data.src;

        if (!src) {
          return;
        }

        this.remove();

        this.loader.load(src, el).then(stack => {
          console.log("stack loaded", stack);
        });
      },

      remove(): void {
        if (!this.model) {
          return;
        }
        this.el.removeObject3D("mesh");
      }
    } as AlVolumetricModelObject;
  }

  public static get Tag(): string {
    return "al-volumetric-model";
  }
}
