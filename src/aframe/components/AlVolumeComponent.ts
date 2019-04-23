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
  planeGeometry: THREE.PlaneGeometry;
  planeMaterial: THREE.MeshBasicMaterial;
  planeMesh: THREE.Mesh;
  zoom: number;
}

interface AlVolumeDefinition extends ComponentDefinition {
  tickFunction(): void;
  handleStack(stack: any, liveChange: boolean): void;
  bindMethods(): void;
  renderBuffer(): void;
}

export class AlVolumeComponent implements AframeRegistryEntry {
  public static get Object(): AlVolumeDefinition {
    return {
      schema: {
        displayMode: { type: "string" },
        isWebGl2: { type: "boolean" },
        rendererEnabled: { type: "boolean", default: true },
        sceneNeedsUpdate: { type: "boolean", default: false },
        slicesIndex: { type: "number" },
        slicesOrientation: { type: "string" },
        slicesWindowCenter: { type: "number" },
        slicesWindowWidth: { type: "number" },
        src: { type: "string" },
        srcLoaded: { type: "boolean" },
        volumeSteps: { type: "number" },
        volumeWindowCenter: { type: "number" },
        volumeWindowWidth: { type: "number" }
      },

      bindMethods(): void {
        this.handleStack = this.handleStack.bind(this);
        this.rendererResize = this.rendererResize.bind(this);
        this.renderBuffer = this.renderBuffer.bind(this);
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

        // this.state.bufferTexture = new THREE.WebGLRenderTarget(
        //   this.el.sceneEl.canvas.width,
        //   this.el.sceneEl.canvas.height,
        //   { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
        // );

        // this.renderBuffer();
      },

      renderBuffer(): void {
        // TODO: Put in state
        // let cam: THREE.PerspectiveCamera = this.el.sceneEl.camera;
        // let dumCamera = new THREE.PerspectiveCamera(
        //   cam.fov,
        //   cam.aspect,
        //   cam.near,
        //   cam.far
        // );

        // let targ = new THREE.Vector3(0, 0, 0);
        // let eye: THREE.Vector3 = cam.position.clone();

        // let dir: THREE.Vector3 = eye.clone().sub(targ.clone());

        // // Normalize fake eye position to be a constant distance from the volume
        // let fakeEye: THREE.Vector3 = targ
        //   .clone()
        //   .add(dir.clone().multiplyScalar(this.state.zoom));
        // dumCamera.position.copy(fakeEye);

        this.el.sceneEl.renderer.render(
          this.state.bufferScene,
          this.el.sceneEl.camera,
          this.state.bufferTexture
        );
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

          let refGeometry: THREE.BoxGeometry = this.state.stackhelper.geometry.clone();
          refGeometry.computeBoundingBox();
          let size = new THREE.Vector3();
          refGeometry.boundingBox.getSize(size);

          let largest = Math.max(size.x, Math.max(size.y, size.z));
          let planeGeometry = new THREE.PlaneGeometry(largest, largest);
          this.state.planeGeometry = planeGeometry;
          this.state.zoom = largest * Constants.zoomFactor;

          let planeMaterial = new THREE.MeshBasicMaterial({
            map: this.state.bufferTexture.texture
          });
          this.state.planeMaterial = planeMaterial;

          let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
          let center = new THREE.Vector3();
          refGeometry.boundingBox.getCenter(center);
          planeMesh.position.copy(center);
          this.state.planeMesh = planeMesh;

          this.el.setObject3D("mesh", planeMesh);
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
        } else if (this.data.displayMode === DisplayMode.VOLUME) {
          this.state.planeMesh.lookAt(this.el.sceneEl.camera.position);

          if (this.state.rendering) {
            this.renderBuffer();
          }
        }
      },

      tick() {
        this.tickFunction();
      },

      remove(): void {
        this.el.removeObject3D("mesh");

        if (this.state.planeMesh) {
          this.state.planeMesh.remove();
        }

        if (this.state.planeMaterial) {
          this.state.planeMaterial.remove();
        }

        if (this.state.planeGeometry) {
          this.state.planeGeometry.remove();
        }
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
