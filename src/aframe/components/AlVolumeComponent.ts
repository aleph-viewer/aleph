import { AframeRegistryEntry, AlCamera } from "../../interfaces";
import { VolumetricLoader } from "../../utils/VolumetricLoader";
import { Constants } from "../../Constants";
import { DisplayMode } from "../../enums";
import { ComponentDefinition } from "aframe";
import { EventUtils } from "../../utils";

interface AlVolumeState {
  stack: any;
  stackhelper: AMI.StackHelper | AMI.VolumeRenderHelper;
  lutHelper: AMI.LutHelper;
  bufferScene: THREE.Scene;
  bufferTexture: THREE.WebGLRenderTarget;
  planeGeometry: THREE.PlaneGeometry;
  planeMaterial: THREE.MeshBasicMaterial;
  planeMesh: THREE.Mesh;
  zoom: number;
  textureWidth: number;
  textureHeight: number;
  localCamera: AlCamera;
}

interface AlVolumeDefinition extends ComponentDefinition {
  addListeners(): void;
  removeListeners(): void;
  tickFunction(): void;
  handleStack(stack: any, liveChange: boolean): void;
  bindMethods(): void;
  renderBuffer(): void;
  moved(event: CustomEvent): void;
  finishedMove(): void;
}

export class AlVolumeComponent implements AframeRegistryEntry {
  public static get Object(): AlVolumeDefinition {
    return {
      schema: {
        displayMode: { type: "string" },
        isWebGl2: { type: "boolean" },
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
        this.removeListeners = this.removeListeners.bind(this);
        this.addListeners = this.addListeners.bind(this);
        this.moved = this.moved.bind(this);
        this.finishedMove = this.finishedMove.bind(this);
      },

      addListeners() {
        this.el.sceneEl.addEventListener(
          "rendererresize",
          this.rendererResize,
          false
        );

        this.el.sceneEl.addEventListener(
          AlVolumeEvents.RENDER_FULL,
          this.finishedMove,
          false
        );

        this.el.sceneEl.addEventListener(
          AlVolumeEvents.MOVED,
          this.moved,
          false
        );

        EventUtils.debounce(this.moved, Constants.minFrameMS);
      },

      removeListeners(): void {
        this.el.sceneEl.removeEventListener(
          "rendererresize",
          this.rendererResize
        );
        this.el.sceneEl.addEventListener(
          AlVolumeEvents.RENDER_FULL,
          this.finishedMove
        );
        this.el.sceneEl.addEventListener(AlVolumeEvents.MOVED, this.moved);
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
          textureHeight: this.el.sceneEl.canvas.clientHeight,
          textureWidth: this.el.sceneEl.canvas.clientWidth
        } as AlVolumeState;

        this.state.bufferTexture = new THREE.WebGLRenderTarget(
          this.state.textureWidth,
          this.state.textureHeight,
          { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
        );

        this.bindMethods();
        this.addListeners();
      },

      rendererResize(): void {
        let state = this.state as AlVolumeState;

        let needsResize =
          state.textureWidth !== this.el.sceneEl.canvas.clientWidth ||
          state.textureHeight !== this.el.sceneEl.canvas.clientHeight;

        if (needsResize) {
          state.textureWidth = this.el.sceneEl.canvas.width;
          state.textureHeight = this.el.sceneEl.canvas.height;
          console.log("renderer resized");
        }

        this.state.bufferTexture = new THREE.WebGLRenderTarget(
          this.el.sceneEl.canvas.width,
          this.el.sceneEl.canvas.height,
          { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
        );

        this.renderBuffer();
      },

      moved(event: CustomEvent) {
        this.state.localCamera = event.detail.cameraState;
        this.el.sceneEl.renderer.setPixelRatio(0.1 * window.devicePixelRatio);
        this.state.stackhelper.steps = 1;
        this.renderBuffer();
      },

      finishedMove() {
        this.el.sceneEl.renderer.setPixelRatio(window.devicePixelRatio);
        this.state.stackhelper.steps = this.data.volumeSteps;
        this.renderBuffer();
      },

      renderBuffer(): void {
        if (this.data.displayMode === DisplayMode.VOLUME) {
          console.log(this.state.stackhelper.steps);
          let camState: AlCamera = this.state.localCamera;

          let targ = camState.target.clone();
          let eye = camState.position.clone();

          // Target position is effectivly an offset from (0, 0, 0), where the stackhelper
          // naturally falls. We need to move the dummy camera back in line with (0, 0, 0)

          // Direction is [end - start]
          // let dir: THREE.Vector3 = targ.clone().sub(eye.clone());

          // let eyeLine = new THREE.Line3(eye.clone(), targ.clone());

          // // Start at the camera, and move [zoom] intervals of [dir] away from the camera towards the target
          let newPos = eye.clone().sub(targ.clone());
          let dumCam: THREE.PerspectiveCamera = this.el.sceneEl.camera.clone();
          dumCam.position.copy(newPos);

          this.el.sceneEl.renderer.render(
            this.state.bufferScene,
            dumCam,
            this.state.bufferTexture
          );
        }
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
      },

      tickFunction(): void {
        if (
          this.state.stackhelper &&
          this.data.displayMode !== DisplayMode.VOLUME
        ) {
          this.el.setObject3D("mesh", this.state.stackhelper);
        } else if (this.data.displayMode === DisplayMode.VOLUME) {
          this.state.planeMesh.lookAt(this.el.sceneEl.camera.position);
        }
      },

      tick() {
        this.tickFunction();
      },

      remove(): void {
        this.el.removeObject3D("mesh");
        this.removeListeners();

        if (this.state.planeMesh) {
          this.state.planeMesh.remove();
        }

        if (this.state.planeMaterial) {
          this.state.planeMaterial.dispose();
        }

        if (this.state.planeGeometry) {
          this.state.planeGeometry.dispose();
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
  static MOVED: string = "al-volume-moved";
  static RENDER_FULL: string = "al-volume-render-full";
}
