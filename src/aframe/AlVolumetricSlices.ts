import { AframeRegistry, AframeComponent } from "../interfaces";
import { VolumetricLoader } from "../utils/VolumetricLoader";
import { Constants } from "../Constants";

interface AlVolumetricSlicesState {
  stack: any;
  stackhelper: AMI.StackHelper;
}

interface AlVolumetricSlicesObject extends AframeComponent {
  update(): void;
  remove(): void;
}

export class AlVolumetricSlices implements AframeRegistry {
  public static get Object(): AlVolumetricSlicesObject {
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

        this.state = {} as AlVolumetricSlicesState;
      },

      update(): void {
        const state = this.state as AlVolumetricSlicesState;
        //const  self = this;
        const el = this.el;
        const src = this.data.src;

        if (!src) {
          return;
        }

        this.remove();

        this.loader.load(src, el).then(stack => {
          state.stack = stack;
          state.stackhelper = new AMI.StackHelper(state.stack);
          state.stackhelper.bbox.visible = false;
          state.stackhelper.border.color = Constants.colorValues.blue;
          el.setObject3D("mesh", state.stackhelper);
          el.sceneEl.emit(
            AlVolumetricSlicesEvents.LOADED,
            {
              stack: state.stack,
              stackhelper: state.stackhelper
            },
            false
          );
        });
      },

      remove(): void {
        if (!this.model) {
          return;
        }
        this.el.removeObject3D("mesh");
      }
    } as AlVolumetricSlicesObject;
  }

  public static get Tag(): string {
    return "al-volumetric-model";
  }
}

export class AlVolumetricSlicesEvents {
  static LOADED: string = "al-slices-loaded";
  static ERROR: string = "al-slices-error";
}
