import { AframeRegistryEntry, AlCamera } from "../../interfaces";
import { VolumetricLoader } from "../../utils/VolumetricLoader";
import { Constants } from "../../Constants";
import { DisplayMode } from "../../enums";
import { ComponentDefinition } from "aframe";
import { AlOrbitControlEvents } from "..";
import { EventUtils, GetUtils } from "../../utils";

interface AlVolumeState {
  bufferScene: THREE.Scene;
  bufferSceneCamera: AlCamera;
  bufferScenePlaneGeometry: THREE.PlaneGeometry;
  bufferScenePlaneMaterial: THREE.MeshBasicMaterial;
  bufferScenePlaneMesh: THREE.Mesh;
  bufferSceneTexture: THREE.WebGLRenderTarget;
  bufferSceneTextureHeight: number;
  bufferSceneTextureWidth: number;
  lutHelper: AMI.LutHelper;
  stack: any;
  stackhelper: AMI.StackHelper | AMI.VolumeRenderHelper;
  zoom: number;
}

interface AlVolumeDefinition extends ComponentDefinition {
  addListeners(): void;
  bindMethods(): void;
  createVolumePlane(): void;
  handleStack(stack: any): void;
  onInteraction(event: CustomEvent): void;
  onInteractionFinished(event: CustomEvent): void;
  removeListeners(): void;
  renderBufferScene(): void;
  tickFunction(): void;
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
        this.addListeners = this.addListeners.bind(this);
        this.createVolumePlane = this.createVolumePlane.bind(this);
        this.handleStack = this.handleStack.bind(this);
        this.onInteraction = this.onInteraction.bind(this);
        this.onInteractionFinished = this.onInteractionFinished.bind(this);
        this.removeListeners = this.removeListeners.bind(this);
        this.renderBufferScene = this.renderBufferScene.bind(this);
        this.rendererResize = this.rendererResize.bind(this);
      },

      addListeners() {
        this.el.sceneEl.addEventListener(
          "rendererresize",
          this.rendererResize,
          false
        );

        this.el.sceneEl.addEventListener(
          AlOrbitControlEvents.INTERACTION,
          this.onInteraction,
          false
        );

        this.el.sceneEl.addEventListener(
          AlOrbitControlEvents.INTERACTION_FINISHED,
          this.onInteractionFinished,
          false
        );
      },

      removeListeners(): void {
        this.el.sceneEl.removeEventListener(
          "rendererresize",
          this.rendererResize
        );

        this.el.sceneEl.removeEventListener(
          AlOrbitControlEvents.INTERACTION,
          this.onInteraction
        );

        this.el.sceneEl.removeEventListener(
          AlOrbitControlEvents.INTERACTION_FINISHED,
          this.onInteractionFinished
        );
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
          bufferSceneTextureHeight: this.el.sceneEl.canvas.clientHeight,
          bufferSceneTextureWidth: this.el.sceneEl.canvas.clientWidth
        } as AlVolumeState;

        this.state.bufferSceneTexture = new THREE.WebGLRenderTarget(
          this.state.bufferSceneTextureWidth,
          this.state.bufferSceneTextureHeight,
          { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
        );

        this.bindMethods();
        this.addListeners();

        this.debouncedRenderBufferScene = EventUtils.debounce(
          this.renderBufferScene,
          Constants.minFrameMS
        ).bind(this);
      },

      onInteraction(event: CustomEvent): void {
        this.state.bufferSceneCamera = event.detail.cameraState;
        this.state.stackhelper.steps = 2;
        this.renderBufferScene();
      },

      onInteractionFinished(event: CustomEvent): void {
        this.state.bufferSceneCamera = event.detail.cameraState;
        this.state.stackhelper.steps = this.data.volumeSteps;
        this.debouncedRenderBufferScene();
      },

      createVolumePlane(): void {
        let targetEntity = this.el.sceneEl.querySelector("#target-entity");

        if (targetEntity) {
          let state = this.state as AlVolumeState;

          let refGeometry: THREE.Geometry = (state.stackhelper as any).mesh.geometry.clone();
          refGeometry.computeBoundingBox();
          refGeometry.computeBoundingSphere();

          state.zoom = refGeometry.boundingSphere.radius * 4.870046858478149;

          let center = targetEntity.object3D.position
            .clone()
            .add(GetUtils.getGeometryCenter(refGeometry));

          let bufferScenePlaneGeometry = new THREE.PlaneGeometry(
            state.bufferSceneTextureWidth,
            state.bufferSceneTextureHeight
          );
          state.bufferScenePlaneGeometry = bufferScenePlaneGeometry;

          let bufferScenePlaneMaterial = new THREE.MeshBasicMaterial({
            map: state.bufferSceneTexture.texture
          });
          // let bufferScenePlaneMaterial = new THREE.MeshBasicMaterial();
          state.bufferScenePlaneMaterial = bufferScenePlaneMaterial;

          let bufferScenePlaneMesh = new THREE.Mesh(
            bufferScenePlaneGeometry,
            bufferScenePlaneMaterial
          );
          bufferScenePlaneMesh.position.copy(center);
          state.bufferScenePlaneMesh = bufferScenePlaneMesh;

          this.el.setObject3D("mesh", bufferScenePlaneMesh);
        }
      },

      rendererResize(): void {
        let state = this.state as AlVolumeState;

        let needsResize =
          state.bufferSceneTextureWidth !==
            this.el.sceneEl.canvas.clientWidth ||
          state.bufferSceneTextureHeight !==
            this.el.sceneEl.canvas.clientHeight;

        if (needsResize && this.data.displayMode === DisplayMode.VOLUME) {
          state.bufferSceneTextureWidth = this.el.sceneEl.canvas.clientWidth;
          state.bufferSceneTextureHeight = this.el.sceneEl.canvas.clientHeight;
          console.log("renderer resized");

          this.state.bufferSceneTexture = new THREE.WebGLRenderTarget(
            state.bufferSceneTextureWidth,
            state.bufferSceneTextureHeight,
            { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
          );

          this.createVolumePlane();
          this.renderBufferScene();
        }
      },

      renderBufferScene(): void {
        if (
          this.state.bufferSceneCamera &&
          this.data.displayMode === DisplayMode.VOLUME
        ) {
          let state = this.state as AlVolumeState;
          let bufferCamera: THREE.PerspectiveCamera = this.el.sceneEl.camera.clone();

          // Adjust bufferCamera position to prevent drift while panning
          // =================================================================
          let cameraState: AlCamera = state.bufferSceneCamera;
          let initialState: AlCamera = GetUtils.getCameraStateFromMesh(
            this.state.stackhelper.mesh
          );

          let inverseInitialTarget: THREE.Vector3 = initialState.target.negate();

          let panAdjustedPosition = cameraState.position
            .clone()
            .sub(cameraState.target.clone())
            .sub(inverseInitialTarget.clone());
          // =================================================================

          // Adjust bufferCamera position to prevent drift while zooming
          // =================================================================
          let start: THREE.Vector3 = this.state.stackhelper.stack.worldCenter();
          let end = panAdjustedPosition.clone();
          let directionToStack = end
            .clone()
            .sub(start.clone())
            .normalize();

          let fixedPosition: THREE.Vector3 = start
            .clone()
            .add(directionToStack.multiplyScalar(state.zoom));
          bufferCamera.position.copy(fixedPosition);
          // =================================================================

          // Sphere showing position of the stackhelper in world space
          // =================================================================
          // let sphere = new THREE.SphereGeometry(3, 8, 8);
          // let sphereM = new THREE.Mesh(
          //   sphere,
          //   new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff0000) })
          // );
          // sphereM.position.copy(this.state.stackhelper.position);
          // state.bufferScene.add(sphereM);
          // =================================================================

          // Sphere showing center of the stackhelper in world space
          // =================================================================
          // let sphere2 = new THREE.SphereGeometry(3, 8, 8);
          // let sphereM2 = new THREE.Mesh(
          //   sphere2,
          //   new THREE.MeshBasicMaterial({ color: new THREE.Color(0x00ff00) })
          // );
          // sphereM.position.copy(this.state.stackhelper.stack.worldCenter());
          // state.bufferScene.add(sphereM2);
          // =================================================================

          this.el.sceneEl.renderer.render(
            state.bufferScene,
            bufferCamera,
            state.bufferSceneTexture
          );
        }
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
            state.stackhelper.textureLUT = state.lutHelper.texture;
            break;
          }
        }

        // If a hot reload of the display, reset the mesh
        if (el.object3DMap.mesh) {
          el.removeObject3D("mesh");
        }

        // If slices mode, set stackhelper as the mesh
        if (this.data.displayMode === DisplayMode.SLICES) {
          el.setObject3D("mesh", this.state.stackhelper);
        } else {
          // Else place it in the buffer scene
          if (this.state.bufferScene.children.length) {
            this.state.bufferScene.remove(this.state.bufferScene.children[0]);
          }

          this.state.bufferScene.add(this.state.stackhelper);

          this.createVolumePlane();
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
          this.removeListeners();
          this.handleStack(state.stack);
          this.addListeners();

          if (this.data.displayMode === DisplayMode.VOLUME) {
            this.renderBufferScene();
          }
        }
      },

      tickFunction(): void {
        if (!this.state.stackhelper) {
          return;
        }

        switch (this.data.displayMode) {
          case DisplayMode.SLICES: {
            this.el.setObject3D("mesh", this.state.stackhelper);
            break;
          }
          case DisplayMode.VOLUME: {
            this.state.bufferScenePlaneMesh.lookAt(
              this.el.sceneEl.camera.position
            );
            break;
          }
        }
      },

      tick() {
        this.tickFunction();
      },

      remove(): void {
        this.el.removeObject3D("mesh");
        this.removeListeners();

        if (this.state.bufferScenePlaneMesh) {
          this.state.bufferScenePlaneMesh.remove();
        }

        if (this.state.bufferScenePlaneMaterial) {
          this.state.bufferScenePlaneMaterial.dispose();
        }

        if (this.state.bufferScenePlaneGeometry) {
          this.state.bufferScenePlaneGeometry.dispose();
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
  static RENDER_LOW: string = "al-volume-render-low";
  static RENDER_FULL: string = "al-volume-render-full";
}
