import { AframeRegistry, AframeComponent } from "../interfaces";
import { VolumetricLoader } from "../utils/VolumetricLoader";
import { Constants } from "../Constants";

interface AlVolumetricSlicesState {
  stack: any;
  stackhelper: AMI.StackHelper;
}

interface AlVolumetricSlicesObject extends AframeComponent {
  update(oldData): void;
  tickFunction(): void;
  tick(): void;
  remove(): void;
  loadSrc(): void;
  bindListeners(): void;
  addListeners(): void;
  removeListeners(): void;
  indexChanged(): void;
}

export class AlVolumetricSlices implements AframeRegistry {
  public static get Object(): AlVolumetricSlicesObject {
    return {
      schema: {
        srcLoaded: { type: "boolean" },
        src: { type: "string" },
        index: { type: "number" },
        orientation: { type: "string" },
        slicesWindowWidth: { type: "number" },
        slicesWindowCenter: { type: "number" }
      },

      bindListeners(): void {
        this.loadSrc = this.loadSrc.bind(this);
        this.indexChanged = this.indexChanged.bind(this);
      },

      addListeners(): void {
        this.el.sceneEl.addEventListener(
          AlVolumetricSlicesEvents.INDEX_CHANGED,
          this.indexChanged,
          false
        );
      },

      removeListeners(): void {
        this.el.sceneEl.removeEventListener(
          AlVolumetricSlicesEvents.INDEX_CHANGED,
          this.indexChanged
        );
      },

      indexChanged(): void {
        if (this.state.stackhelper) {
          this.el.setObject3D("mesh", this.state.stackhelper);
        }
      },

      init(): void {
        this.tickFunction = AFRAME.utils.throttle(
          this.tickFunction,
          Constants.minFrameMS,
          this
        );
        this.loader = new VolumetricLoader();
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
          this.indexChanged();
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
  static INDEX_CHANGED: string = "al-slices-index-changed";
}
