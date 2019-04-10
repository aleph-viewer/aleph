import { AframeRegistry, AframeComponent } from "../interfaces";
import { VolumetricLoader } from "../utils/VolumetricLoader";
import { Constants } from "../Constants";

interface AlVolumeState {
  stack: any;
  stackhelper: AMI.VolumeRenderingHelper;
  lutHelper: AMI.LutHelper;
}

interface AlVolumeObject extends AframeComponent {
  update(oldData): void;
  tickFunction(): void;
  tick(): void;
  remove(): void;
  loadSrc(): void;
  bindMethods(): void;
}

export class AlVolume implements AframeRegistry {
  public static get Object(): AlVolumeObject {
    return {
      schema: {
        srcLoaded: { type: "boolean" },
        src: { type: "string" },
        steps: { type: "number" },
        volumeWindowWidth: { type: "number" },
        volumeWindowCenter: { type: "number" }
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
        this.state = {} as AlVolumeState;
        this.bindMethods();
      },

      loadSrc(): void {
        const state = this.state as AlVolumeState;
        const el = this.el;
        const src = this.data.src;

        this.loader.load(src, el).then(stack => {
          // Get LUT Canvas
          const lutCanvases: HTMLElement = el.sceneEl.parentEl.querySelector(
            "#lut-canvases"
          );

          // Create the LUT Helper
          state.lutHelper = new AMI.LutHelper(lutCanvases);
          state.lutHelper.luts = AMI.LutHelper.presetLuts();
          state.lutHelper.lutsO = AMI.LutHelper.presetLutsO();

          state.stack = stack;
          state.stackhelper = new AMI.VolumeRenderingHelper(state.stack);
          state.stackhelper.uniforms.uTextureLUT.value =
            state.lutHelper.texture;
          state.stackhelper.uniforms.uLut.value = 1;
          //this.el.setObject3D("mesh", this.state.stackhelper);
          el.sceneEl.emit(
            AlVolumeEvents.LOADED,
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

      tickFunction(): void {},

      tick() {
        this.tickFunction();
      },

      remove(): void {
        //this.el.removeObject3D("mesh");
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
