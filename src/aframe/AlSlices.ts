import { AframeRegistry, AframeComponent } from "../interfaces";
import { VolumetricLoader } from "../utils/VolumetricLoader";
import { Constants } from "../Constants";

interface AlSlicesState {
  stack: any;
  stackhelper: AMI.StackHelper;
}

interface AlSlicesObject extends AframeComponent {
  update(oldData): void;
  tickFunction(): void;
  tick(): void;
  remove(): void;
  loadSrc(): void;
  bindMethods(): void;
}

export class AlSlices implements AframeRegistry {
  public static get Object(): AlSlicesObject {
    return {
      schema: {
        srcLoaded: { type: "boolean" },
        src: { type: "string" },
        index: { type: "number" },
        orientation: { type: "string" },
        slicesWindowWidth: { type: "number" },
        slicesWindowCenter: { type: "number" }
      },

      bindMethods(): void {
        this.loadSrc = this.loadSrc.bind(this);
      },

      init(): void {
        this.tickFunction = AFRAME.utils.throttle(
          this.tickFunction,
          Constants.minFrameMS,
          this
        );
        this.loader = new VolumetricLoader();
        this.state = {} as AlSlicesState;
        this.bindMethods();
      },

      loadSrc(): void {
        const state = this.state as AlSlicesState;

        // if there is already a stack, fire a loaded event immediately with the stackhelper
        // (this happens when switching between volume/slices display modes)
        if (state.stack) {
          this.parseStack(state.stack);
        } else {
          this.loader.load(this.data.src).then(stack => {
            this.parseStack(stack);
          });
        }
      },

      parseStack(stack: any): void {
        const state = this.state as AlSlicesState;
        const el = this.el;

        state.stack = stack;
        state.stackhelper = new AMI.StackHelper(state.stack);
        state.stackhelper.bbox.visible = false;
        state.stackhelper.border.color = Constants.colorValues.blue;
        el.setObject3D("mesh", state.stackhelper);
        el.sceneEl.emit(
          AlSlicesEvents.LOADED,
          {
            stack: state.stack,
            stackhelper: state.stackhelper
          },
          false
        );
      },

      update(oldData): void {
        if (!this.data.src) {
          return;
        } else if (oldData && oldData.src !== this.data.src) {
          this.loadSrc();
        }
      },

      tickFunction(): void {
        if (this.state.stackhelper) {
          this.el.setObject3D("mesh", this.state.stackhelper);
        }
      },

      tick() {
        this.tickFunction();
      },

      remove(): void {
        this.el.removeObject3D("mesh");
      }
    } as AlSlicesObject;
  }

  public static get Tag(): string {
    return "al-slices";
  }
}

export class AlSlicesEvents {
  static LOADED: string = "al-slices-loaded";
  static ERROR: string = "al-slices-error";
}
