import { AframeRegistryEntry, AframeComponent } from "../interfaces";
import { VolumetricLoader } from "../utils/VolumetricLoader";
import { Constants } from "../Constants";
import { DisplayMode } from "../enums";

interface AlVolumeState {
  stack: any;
  stackhelper: AMI.VolumeRenderHelper | AMI.StackHelper;
  lutHelper: AMI.LutHelper;
}

interface AlVolumeObject extends AframeComponent {
  update(oldData): void;
  tickFunction(): void;
  tick(): void;
  remove(): void;
  handleStack(stack: any): void;
  bindMethods(): void;
}

export class AlVolume implements AframeRegistryEntry {
  public static get Object(): AlVolumeObject {
    return {
      schema: {
        srcLoaded: { type: "boolean" },
        src: { type: "string" },
        displayMode: { type: "string" },
        slicesIndex: { type: "number" },
        slicesOrientation: { type: "string" },
        slicesWindowWidth: { type: "number" },
        slicesWindowCenter: { type: "number" },
        volumeSteps: { type: "number" },
        volumeWindowWidth: { type: "number" },
        volumeWindowCenter: { type: "number" }
      },

      bindMethods(): void {
        this.handleStack = this.handleStack.bind(this);
      },

      init(): void {
        this.tickFunction = AFRAME.utils.throttle(
          this.tickFunction,
          Constants.minFrameMS,
          this
        );
        this.loader = new VolumetricLoader();
        this.state = {} as AlVolumeState;
        this.bindMethods();
      },

      handleStack(stack: any): void {
        const state = this.state as AlVolumeState;
        const el = this.el;

        state.stack = stack;

        switch (this.data.displayMode) {
          case DisplayMode.SLICES: {
            state.stackhelper = new AMI.StackHelper(state.stack);
            state.stackhelper.bbox.visible = false;
            state.stackhelper.border.color = Constants.colorValues.blue;
            break;
          }
          case DisplayMode.VOLUME: {
            // Get LUT Canvas
            const lutCanvases: HTMLElement = el.sceneEl.parentEl.querySelector(
              "#lut-canvases"
            );
            // Create the LUT Helper
            state.lutHelper = new AMI.LutHelper(lutCanvases);
            state.lutHelper.luts = AMI.LutHelper.presetLuts();
            state.lutHelper.lutsO = AMI.LutHelper.presetLutsO();
            state.stackhelper = new AMI.VolumeRenderHelper(state.stack);
            state.stackhelper.uniforms.uTextureLUT.value =
              state.lutHelper.texture;
            state.stackhelper.uniforms.uLut.value = 1;
            break;
          }
        }

        el.sceneEl.emit(AlVolumeEvents.LOADED, state.stackhelper, false);
      },

      update(oldData): void {
        const state = this.state;
        const el = this.el;

        if (!this.data.src) {
          return;
        } else if (oldData && oldData.src !== this.data.src) {
          this.loader.load(this.data.src, el).then(stack => {
            this.handleStack(stack);
          });
        } else if (
          oldData &&
          oldData.displayMode !== this.data.displayMode &&
          state.stack
        ) {
          this.handleStack(state.stack);
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
    } as AlVolumeObject;
  }

  public static get Tag(): string {
    return "al-volume";
  }
}

export class AlVolumeEvents {
  static LOADED: string = "al-volume-loaded";
  static ERROR: string = "al-volume-error";
}
