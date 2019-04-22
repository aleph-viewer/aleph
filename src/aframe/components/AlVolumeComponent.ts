import { AframeRegistryEntry } from "../../interfaces";
import { VolumetricLoader } from "../../utils/VolumetricLoader";
import { Constants } from "../../Constants";
import { DisplayMode } from "../../enums";
import { ComponentDefinition } from "aframe";

interface AlVolumeState {
  stack: any;
  stackhelper: AMI.StackHelper | AMI.VolumeRenderHelper;
  lutHelper: AMI.LutHelper;
  bufferScene: THREE.Scene;
  bufferTexture: THREE.WebGLRenderTarget;
  rendering: boolean;
  geometry: THREE.BoxGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
}

interface AlVolumeDefinition extends ComponentDefinition {
  tickFunction(): void;
  handleStack(stack: any, liveChange: boolean): void;
  bindMethods(): void;
}

export class AlVolumeComponent implements AframeRegistryEntry {
  public static get Object(): AlVolumeDefinition {
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
        volumeWindowCenter: { type: "number" },
        isWebGl2: { type: "boolean" },
        rendererEnabled: { type: "boolean", default: true }
      },

      bindMethods(): void {
        this.handleStack = this.handleStack.bind(this);
        this.rendererResize = this.rendererResize.bind(this);
      },

      init(): void {
        this.tickFunction = AFRAME.utils.throttle(
          this.tickFunction,
          Constants.minFrameMS,
          this
        );
        this.loader = new VolumetricLoader();
        this.state = {
          bufferScene: new THREE.Scene(),
          bufferTexture: new THREE.WebGLRenderTarget(
            this.el.sceneEl.canvas.width,
            this.el.sceneEl.canvas.height,
            { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
          ),
          rendering: true
        } as AlVolumeState;

        this.el.sceneEl.addEventListener(
          "rendererresize",
          this.rendererResize,
          false
        );

        this.bindMethods();
      },

      rendererResize(): void {
        console.log("renderer resized");
      },

      handleStack(stack: any, liveChange: boolean): void {
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
            state.stackhelper.textureLUT = state.lutHelper.texture;
            break;
          }
        }

        // If a hot reload of the display, reset the mesh
        if (liveChange) {
          this.el.removeObject3D("mesh");
        }

        // If not volumetric, display as normal
        if (this.data.displayMode !== DisplayMode.VOLUME) {
          this.el.setObject3D("mesh", this.state.stackhelper);
        }
        // Else place in buffer scene
        else {
          this.state.bufferScene.add(this.state.stackhelper);

          let geometry = this.state.stackhelper.geometry.clone();
          this.state.geometry = geometry;

          let material = new THREE.MeshBasicMaterial({
            map: this.state.bufferTexture
          });
          this.state.material = material;

          let mesh = new THREE.Mesh(geometry, material);
          this.state.mesh = mesh;

          this.el.setObject3D("mesh", mesh);
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
            this.handleStack(stack, false);
          });
        } else if (
          oldData &&
          oldData.displayMode !== this.data.displayMode &&
          state.stack
        ) {
          this.handleStack(state.stack, true);
        }

        if (
          oldData &&
          this.state.stackhelper &&
          oldData.rendererEnabled !== this.data.rendererEnabled
        ) {
          if (this.data.rendererEnabled) {
            setTimeout(() => {
              if (
                this.state.stackhelper &&
                this.data.displayMode === DisplayMode.VOLUME
              ) {
                // this.state.stackhelper.isPaused = 0;
                console.log("enable renderer");
                this.state.rendering = true;
              }
            }, Constants.minFrameMS);
          } else {
            setTimeout(() => {
              if (
                this.state.stackhelper &&
                this.data.displayMode === DisplayMode.VOLUME
              ) {
                // this.state.stackhelper.isPaused = 1;
                console.log("disable renderer");
                this.state.rendering = false;
              }
            }, Constants.minFrameMS);
          }
        }
      },

      tickFunction(): void {
        if (
          this.state.stackhelper &&
          this.data.displayMode !== DisplayMode.VOLUME
        ) {
          this.el.setObject3D("mesh", this.state.stackhelper);
        } else if (
          this.state.rendering &&
          this.data.displayMode === DisplayMode.VOLUME
        ) {
          this.el.sceneEl.renderer.render(
            this.state.bufferScene,
            this.el.sceneEl.camera,
            this.state.bufferTexture
          );
        }
      },

      tick() {
        this.tickFunction();
      },

      remove(): void {
        this.el.removeObject3D("mesh");
      }
    } as AlVolumeDefinition;
  }

  public static get Tag(): string {
    return "al-volume";
  }
}

export class AlVolumeEvents {
  static LOADED: string = "al-volume-loaded";
  static ERROR: string = "al-volume-error";
}
