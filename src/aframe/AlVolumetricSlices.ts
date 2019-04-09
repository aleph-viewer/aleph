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
  loadPath(): void;
  bindMethods(): void;
}

export class AlVolumetricSlices implements AframeRegistry {
  public static get Object(): AlVolumetricSlicesObject {
    return {
      schema: {
        path: { type: "string" },
        index: { type: "number" }
      },

      bindMethods(): void {
        this.loadPath = this.loadPath.bind(this);
      },

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
        this.bindMethods();
      },

      loadPath(): void {
        const state = this.state as AlVolumetricSlicesState;
        const el = this.el;
        const path = this.data.path;

        this.loader.load(path, el).then(stack => {
          state.stack = stack;
          state.stackhelper = new AMI.StackHelper(state.stack);
          state.stackhelper.bbox.visible = false;
          state.stackhelper.border.color = Constants.colorValues.blue;
          this.el.setObject3D("mesh", this.state.stackhelper);
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
        const data = this.data;
        const state = this.state as AlVolumetricSlicesState;

        if (!data.path) {
          return;
        } else if (oldData && oldData.path !== data.path) {
          this.loadPath();
        }

        if (oldData && oldData.index !== data.index) {
          if (state.stackhelper) {
            state.stackhelper.index = data.index;
          }
        }

        if (state.stackhelper) {
          console.log("al-slices-update: mesh set!");
          this.el.setObject3D("mesh", state.stackhelper);
        }
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
    return "al-volumetric-slices";
  }
}

export class AlVolumetricSlicesEvents {
  static LOADED: string = "al-slices-loaded";
  static ERROR: string = "al-slices-error";
}
