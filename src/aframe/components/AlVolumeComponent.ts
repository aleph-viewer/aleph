import { AframeRegistryEntry, AlCamera } from "../../interfaces";
import { VolumetricLoader } from "../../utils/VolumetricLoader";
import { Constants } from "../../Constants";
import { DisplayMode } from "../../enums";
import { ComponentDefinition } from "aframe";
import { ThreeUtils } from "../../utils";

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
  createMesh(): void;
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
        volumeWindowWidth: { type: "number" },
        bboxPosition: { type: "vec3" }
      },

      bindMethods(): void {
        this.handleStack = this.handleStack.bind(this);
        this.rendererResize = this.rendererResize.bind(this);
        this.renderBuffer = this.renderBuffer.bind(this);
        this.removeListeners = this.removeListeners.bind(this);
        this.addListeners = this.addListeners.bind(this);
        this.moved = this.moved.bind(this);
        this.finishedMove = this.finishedMove.bind(this);
        this.createMesh = this.createMesh.bind(this);
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

      createMesh() {
        let state = this.state as AlVolumeState;

        let refGeometry: THREE.Geometry = (state.stackhelper as any).mesh.geometry.clone();
        refGeometry.computeBoundingBox();
        refGeometry.computeBoundingSphere();
        state.zoom = refGeometry.boundingSphere.radius * 5;
        let center = this.state.stackhelper.stack.worldCenter();

        let planeGeometry = new THREE.PlaneGeometry(
          state.textureWidth,
          state.textureHeight
        );
        state.planeGeometry = planeGeometry;

        let planeMaterial = new THREE.MeshBasicMaterial({
          map: state.bufferTexture.texture
        });
        state.planeMaterial = planeMaterial;

        let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.position.copy(center);
        state.planeMesh = planeMesh;

        let geom = new THREE.PlaneGeometry(
          state.textureWidth,
          state.textureHeight
        );
        geom.scale(1.01, 1.01, 1.01);
        let mat = new THREE.MeshBasicMaterial();
        mat.wireframe = true;
        let mesh = new THREE.Mesh(geom, mat);
        planeMesh.add(mesh);
        state.planeMesh = planeMesh;

        this.el.setObject3D("mesh", planeMesh);
      },

      rendererResize(): void {
        let state = this.state as AlVolumeState;

        let needsResize =
          state.textureWidth !== this.el.sceneEl.canvas.clientWidth ||
          state.textureHeight !== this.el.sceneEl.canvas.clientHeight;

        if (needsResize && this.data.displayMode === DisplayMode.VOLUME) {
          state.textureWidth = this.el.sceneEl.canvas.clientWidth;
          state.textureHeight = this.el.sceneEl.canvas.clientHeight;
          console.log("renderer resized");

          this.state.bufferTexture = new THREE.WebGLRenderTarget(
            state.textureWidth,
            state.textureHeight,
            { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
          );

          this.createMesh();
          this.renderBuffer();
        }
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
          let state = this.state as AlVolumeState;

          console.log(
            "render-buffer steps: ",
            (state.stackhelper as any).steps
          );
          let camState: AlCamera = state.localCamera;

          let targ = camState.target.clone();
          let eye = camState.position.clone();

          // Target position is offset from (0, 0, 0), where the stackhelper
          // naturally falls. We need to move the dummy camera back in line with (0, 0, 0)
          let dumPos = eye
            .clone()
            // Offsets by -targ
            .sub(targ.clone())
            // Offsets by -bboxPosition
            // .add(ThreeUtils.objectToVector3(this.data.bboxPosition));
          let dumCam: THREE.PerspectiveCamera = this.el.sceneEl.camera.clone();

          // Dir S->E === End - Start
          let dir = ThreeUtils.objectToVector3(this.data.bboxPosition)
            .sub(dumPos.clone())
            .normalize()
            .negate();

          // Start at the target, and move [zoom] intervals of [dir] away from the target towards the camera
          let newPos = dir.clone().multiplyScalar(state.zoom);
          dumCam.position.copy(newPos);

          this.el.sceneEl.renderer.render(
            state.bufferScene,
            dumCam,
            state.bufferTexture
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
          this.createMesh();
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
          this.removeListeners();
          this.handleStack(state.stack, true);
          this.addListeners();
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
