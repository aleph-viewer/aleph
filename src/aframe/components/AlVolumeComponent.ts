import { AlOrbitControlEvents } from "..";
import { Constants } from "../../Constants";
import { DisplayMode } from "../../enums";
import { EventUtils, GetUtils } from "../../utils";
import { VolumetricLoader } from "../../utils/VolumetricLoader";
import { BaseComponent } from "./BaseComponent";

export class AlVolumeEvents {
  public static LOADED: string = "al-volume-loaded";
  public static ERROR: string = "al-volume-error";
  public static RENDER_LOW: string = "al-volume-render-low";
  public static RENDER_FULL: string = "al-volume-render-full";
}

interface AlVolumeState {
  bufferScene: THREE.Scene;
  bufferScenePlaneGeometry: THREE.PlaneGeometry;
  bufferScenePlaneMaterial: THREE.MeshBasicMaterial;
  bufferScenePlaneMesh: THREE.Mesh;
  bufferSceneTexture: THREE.WebGLRenderTarget;
  lutHelper: AMI.LutHelper;
  // tslint:disable-next-line: no-any
  stack: any;
  bufferSceneTextureHeight: number;
  bufferSceneTextureWidth: number;
  stackhelper: AMI.StackHelper | AMI.VolumeRenderHelper;
}

interface AlVolumeComponent extends BaseComponent {
  createVolumePlane(): void;
  // tslint:disable-next-line: no-any
  handleStack(stack: any): void;
  onInteraction(event: CustomEvent): void;
  onInteractionFinished(event: CustomEvent): void;
  renderBufferScene(): void;
  tickFunction(): void;
  createBufferTexture(): void;
}

export default AFRAME.registerComponent("al-volume", {
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

    this.bindMethods();
    this.addEventListeners();

    this.createBufferTexture();

    this.debouncedRenderBufferScene = EventUtils.debounce(
      this.renderBufferScene,
      Constants.minFrameMS
    ).bind(this);
  },

  bindMethods(): void {
    this.addEventListeners = this.addEventListeners.bind(this);
    this.createVolumePlane = this.createVolumePlane.bind(this);
    this.handleStack = this.handleStack.bind(this);
    this.onInteraction = this.onInteraction.bind(this);
    this.onInteractionFinished = this.onInteractionFinished.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
    this.renderBufferScene = this.renderBufferScene.bind(this);
    this.rendererResize = this.rendererResize.bind(this);
    this.createBufferTexture = this.createBufferTexture.bind(this);
  },

  addEventListeners() {
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

  removeEventListeners(): void {
    this.el.sceneEl.removeEventListener("rendererresize", this.rendererResize);

    this.el.sceneEl.removeEventListener(
      AlOrbitControlEvents.INTERACTION,
      this.onInteraction
    );

    this.el.sceneEl.removeEventListener(
      AlOrbitControlEvents.INTERACTION_FINISHED,
      this.onInteractionFinished
    );
  },

  createBufferTexture(): void {
    this.state.bufferSceneTexture = new THREE.WebGLRenderTarget(
      this.state.bufferSceneTextureWidth,
      this.state.bufferSceneTextureHeight,
      { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
    );
    (this.el.sceneEl
      .object3D as THREE.Scene).background = this.state.bufferSceneTexture.texture;
  },

  onInteraction(_event: CustomEvent): void {
    if (this.state.stackhelper) {
      this.state.stackhelper.steps = 2;
      this.renderBufferScene();
    }
  },

  onInteractionFinished(_event: CustomEvent): void {
    if (this.state.stackhelper) {
      this.state.stackhelper.steps = this.data.volumeSteps;
      this.debouncedRenderBufferScene();
    }
  },

  createVolumePlane(): void {
    const targetEntity = this.el.sceneEl.querySelector("#target-entity");

    if (targetEntity) {
      const state = this.state as AlVolumeState;

      // tslint:disable-next-line: no-any
      const refGeometry: THREE.Geometry = (state.stackhelper as any).mesh.geometry.clone();
      refGeometry.computeBoundingBox();
      refGeometry.computeBoundingSphere();

      const center = targetEntity.object3D.position
        .clone()
        .add(GetUtils.getGeometryCenter(refGeometry));

      const x = this.state.stackhelper.stack.dimensionsIJK.x;
      const y = this.state.stackhelper.stack.dimensionsIJK.y;
      const z = this.state.stackhelper.stack.dimensionsIJK.z;

      const size = Math.max(x, Math.max(y, z));

      const bufferScenePlaneGeometry = new THREE.PlaneGeometry(size, size);
      state.bufferScenePlaneGeometry = bufferScenePlaneGeometry;

      const bufferScenePlaneMaterial = new THREE.MeshBasicMaterial({
        // opacity: 0.1,
        // transparent: true
        visible: false
      });
      state.bufferScenePlaneMaterial = bufferScenePlaneMaterial;

      const bufferScenePlaneMesh = new THREE.Mesh(
        bufferScenePlaneGeometry,
        bufferScenePlaneMaterial
      );
      bufferScenePlaneMesh.position.copy(center);
      bufferScenePlaneMesh.renderOrder = Constants.topLayerRenderOrder - 4;
      state.bufferScenePlaneMesh = bufferScenePlaneMesh;

      this.el.setObject3D("mesh", bufferScenePlaneMesh);
    }
  },

  rendererResize(): void {
    const state = this.state as AlVolumeState;

    const needsResize =
      state.bufferSceneTextureWidth !== this.el.sceneEl.canvas.clientWidth ||
      state.bufferSceneTextureHeight !== this.el.sceneEl.canvas.clientHeight;

    if (needsResize && this.data.displayMode === DisplayMode.VOLUME) {
      state.bufferSceneTextureWidth = this.el.sceneEl.canvas.clientWidth;
      state.bufferSceneTextureHeight = this.el.sceneEl.canvas.clientHeight;

      this.createBufferTexture();
      this.renderBufferScene();
    }
  },

  renderBufferScene(): void {
    if (this.data.displayMode === DisplayMode.VOLUME) {
      this.el.sceneEl.renderer.render(
        this.state.bufferScene,
        this.el.sceneEl.camera,
        this.state.bufferSceneTexture
      );
    }
  },

  // tslint:disable-next-line: no-any
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
      default: {
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

  // tslint:disable-next-line: no-any
  update(oldData: any): void {
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
      this.removeEventListeners();
      this.handleStack(state.stack);
      this.addEventListeners();

      if (this.data.displayMode === DisplayMode.VOLUME) {
        this.createBufferTexture();
        setTimeout(() => {
          this.renderBufferScene();
        }, 250); // allow some time for the stackhelper to reorient itself
      } else {
        (this.el.sceneEl.object3D as THREE.Scene).background = null;
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
        this.state.bufferScenePlaneMesh.lookAt(this.el.sceneEl.camera.position);
        break;
      }
      default: {
        break;
      }
    }
  },

  tick() {
    this.tickFunction();
  },

  remove(): void {
    this.el.removeObject3D("mesh");
    this.removeEventListeners();

    (this.el.sceneEl.object3D as THREE.Scene).background = null;

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
} as AlVolumeComponent);
