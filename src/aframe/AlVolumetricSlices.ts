import { AframeRegistry, AframeComponent } from "../interfaces";
import { VolumetricLoader } from "../utils/VolumetricLoader";
import { Constants } from "../Constants";

interface AlVolumetricSlicesState {
  stack: any;
  stackhelper: AMI.StackHelper;
}

interface AlVolumetricSlicesObject extends AframeComponent {
  update(oldData): void;
  remove(): void;
  loadSrc(): void;
  bindListeners(): void;
  addListeners(): void;
  removeListeners(): void;
}

export class AlVolumetricSlices implements AframeRegistry {
  public static get Object(): AlVolumetricSlicesObject {
    return {
      schema: {
        src: { type: "string", default: "" },
        index: { type: "number", default: 0 }
      },

      bindListeners(): void {
        this.loadSrc = this.loadSrc.bind(this);
      },

      addListeners(): void {},

      removeListeners(): void {},

      init(): void {
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
        this.bindListeners();
        this.addListeners();
      },

      loadSrc(): void {
        const state = this.state as AlVolumetricSlicesState;
        const el = this.el;
        const src = this.data.src;

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

      update(oldData): void {
        if (!this.data.src) {
          return;
        } else if (oldData && oldData.src !== this.data.src) {
          this.remove();
          this.loadSrc();
        }

        if (oldData.index !== this.data.index) {
          if (this.state.stackhelper) {
            console.log("new index: ", this.data.index);
            this.state.stackhelper.index = this.data.index;
          }
        }
      },

      remove(): void {
        this.removeListeners();
        if (!this.model) {
          return;
        }
        this.el.removeObject3D("mesh");
      }
    } as AlVolumetricSlicesObject;
  }

  public static get Tag(): string {
    return "al-volumetric-slices";
  }
}

export class AlVolumetricSlicesEvents {
  static LOADED: string = "al-slices-loaded";
  static ERROR: string = "al-slices-error";
}
