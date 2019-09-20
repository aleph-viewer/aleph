import { Constants } from "../../Constants";
import { DisplayMode, Orientation } from "../../enums";
import { AMIUtils, EventUtils, Utils } from "../../utils";
import { AlControlEvents } from "../../utils/AlControlEvents";
import { VolumetricLoader } from "../../utils/VolumetricLoader";
import { BaseComponent } from "./BaseComponent";

export class AlVolumeEvents {
  public static ERROR: string = "al-volume-error";
  public static LOADED: string = "al-volume-loaded";
  public static VOLUME_RAY_REQUEST: string = "al-volume-ray-requested";
  public static VOLUME_RAY_CAST: string = "al-volume-ray-cast";
}

interface AlVolumeState {
  bufferScene: THREE.Scene;
  bufferSceneTexture: THREE.WebGLRenderTarget;
  bufferSceneTextureHeight: number;
  bufferSceneTextureWidth: number;
  debounce: boolean;
  frameTime: number;
  loaded: boolean;
  lutHelper: AMI.LutHelper;
  lastRenderTime: number;
  renderSteps: number;
  // tslint:disable-next-line: no-any
  stack: any;
  stackhelper: AMI.StackHelper | AMI.VolumeRenderHelper;
}

interface AlVolumeComponent extends BaseComponent {
  // tslint:disable-next-line: no-any
  handleStack(stack: any): void;
  onInteraction(event: CustomEvent): void;
  onInteractionFinished(event: CustomEvent): void;
  renderBufferScene(): void;
  tickFunction(): void;
  createBufferTexture(): void;
  castVolumeRay(event: CustomEvent): void;
}

export default AFRAME.registerComponent("al-volume", {
  schema: {
    controlsType: { type: "string" },
    displayMode: { type: "string" },
    isHighRes: { type: "boolean", default: false },
    isWebGl2: { type: "boolean" },
    slicesIndex: { type: "number" },
    slicesOrientation: { type: "string" },
    slicesWindowCenter: { type: "number" },
    slicesWindowWidth: { type: "number" },
    src: { type: "string" },
    srcLoaded: { type: "boolean" },
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
      bufferSceneTextureWidth: this.el.sceneEl.canvas.clientWidth,
      debounce: false,
      frameTime: window.performance.now(),
      loaded: false,
      lastRenderTime: 0,
      renderSteps: 0
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
    this.castVolumeRay = this.castVolumeRay.bind(this);
    this.createBufferTexture = this.createBufferTexture.bind(this);
    this.getRenderSteps = this.getRenderSteps.bind(this);
    this.handleStack = this.handleStack.bind(this);
    this.onInteraction = this.onInteraction.bind(this);
    this.onInteractionFinished = this.onInteractionFinished.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
    this.renderBufferScene = this.renderBufferScene.bind(this);
    this.rendererResize = this.rendererResize.bind(this);
    this.updateSlicesStack = this.updateSlicesStack.bind(this);
    this.updateVolumeStack = this.updateVolumeStack.bind(this);
  },

  addEventListeners() {
    this.el.sceneEl.addEventListener(
      "rendererresize",
      this.rendererResize,
      false
    );

    this.el.sceneEl.addEventListener(
      AlControlEvents.INTERACTION,
      this.onInteraction,
      false
    );

    this.el.sceneEl.addEventListener(
      AlControlEvents.INTERACTION_FINISHED,
      this.onInteractionFinished,
      false
    );
    this.el.sceneEl.addEventListener(
      AlVolumeEvents.VOLUME_RAY_REQUEST,
      this.castVolumeRay,
      false
    );
  },

  removeEventListeners(): void {
    this.el.sceneEl.removeEventListener("rendererresize", this.rendererResize);

    this.el.sceneEl.removeEventListener(
      AlControlEvents.INTERACTION,
      this.onInteraction
    );
    this.el.sceneEl.removeEventListener(
      AlControlEvents.INTERACTION_FINISHED,
      this.onInteractionFinished
    );
    this.el.sceneEl.addEventListener(
      AlVolumeEvents.VOLUME_RAY_REQUEST,
      this.castVolumeRay
    );
  },

  castVolumeRay(event: CustomEvent) {
    const camPos: THREE.Vector3 = event.detail.cameraPosition;
    const camDir: THREE.Vector3 = event.detail.cameraDirection;
    const intersection: THREE.Vector3 = event.detail.intersection;

    const hitPosition = new THREE.Vector3();
    const hitNormal = new THREE.Vector3();

    const rayResult = AMIUtils.volumeRay(
      this.state.stackhelper,
      camPos,
      camDir,
      Constants.camera.far,
      hitPosition,
      hitNormal
    );

    this.el.sceneEl.emit(AlVolumeEvents.VOLUME_RAY_CAST, {
      hitPosition,
      intersection,
      rayResult,
      hitNormal
    });
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
    if (this.state.stackhelper && _event.detail.needsRender) {
      this.state.renderSteps = 2;
    }
  },

  onInteractionFinished(_event: CustomEvent): void {
    if (this.state.stackhelper && _event.detail.needsRender) {
      this.state.renderSteps = this.getRenderSteps();
    }

    this.state.debounce = false;
  },

  getRenderSteps(): number {
    // 128 steps for desktop (7), 32 steps for mobile (5)
    let power;

    if (AFRAME.utils.device.isMobile()) {
      power = 5;
    } else {
      power = 7;
    }

    const res = Math.pow(2, power + (this.data.isHighRes ? 1 : 0));

    return res;
  },

  rendererResize(): void {
    const state = this.state as AlVolumeState;

    const needsResize =
      state.bufferSceneTextureWidth !== this.el.sceneEl.canvas.clientWidth ||
      state.bufferSceneTextureHeight !== this.el.sceneEl.canvas.clientHeight;

    if (needsResize && this.data.displayMode === DisplayMode.VOLUME) {
      state.bufferSceneTextureWidth = this.el.sceneEl.canvas.clientWidth;
      state.bufferSceneTextureHeight = this.el.sceneEl.canvas.clientHeight;

      this.state.renderSteps = this.getRenderSteps();
    }
  },

  renderBufferScene(): void {
    if (this.data.displayMode === DisplayMode.VOLUME) {
      this.createBufferTexture();

      this.state.stackhelper.steps = this.state.renderSteps;

      const prev = window.performance.now();

      this.el.sceneEl.renderer.render(
        this.state.bufferScene,
        this.el.sceneEl.camera,
        this.state.bufferSceneTexture
      );

      const post = window.performance.now();
      const renderTime: number = post - prev;

      this.state.lastRenderTime = renderTime;
      this.state.renderSteps = 0;
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
        state.stackhelper.border.color = Constants.colors.blue;
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
        state.stackhelper.steps = this.getRenderSteps();
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
    }

    if (!this.state.loaded) {
      el.sceneEl.emit(AlVolumeEvents.LOADED, state.stackhelper, false);
      this.state.loaded = true;
    }
  },

  updateSlicesStack(): void {
    if (
      !this.state.stackhelper ||
      (this.state.stackhelper &&
        !(this.state.stackhelper as AMI.StackHelper).slice)
    ) {
      return;
    }

    const orientationIndex: number = Object.keys(Orientation).indexOf(
      this.data.slicesOrientation.toUpperCase()
    );

    // based off zCosine, x:1 = saggital, y:1 = coronal, z:1 = axial
    const zCosine: THREE.Vector3 = this.state.stackhelper.stack
      .zCosine as THREE.Vector3;

    let orientationOffset;
    // If DICOM's up axis is X, offset the viewer's orientation by 1
    if (Math.round(zCosine.x) === 1) {
      orientationOffset = 1;
    }
    // If the DICOM's up is Y, offset the viewer's orientation by 2
    else if (Math.round(zCosine.y) === 1) {
      orientationOffset = 2;
    }
    // Else Orientation matches viewer orientation, no offset
    else {
      orientationOffset = 0;
    }

    // Wrap the orientationIndex so that it may never exceed 2
    const displayOrientationIndex = Math.round(
      (orientationIndex + orientationOffset) % 3
    );
    const stackOrientationIndex = Math.round(
      (orientationIndex + orientationOffset + 2) % 3
    );

    const slicesIndexMax: number =
      this.state.stackhelper.stack.dimensionsIJK[
        Object.keys(this.state.stackhelper.stack.dimensionsIJK)[
          stackOrientationIndex
        ]
      ] - 1;
    let index: number;

    if (
      stackOrientationIndex !== this._lastStackOrientationIndex ||
      this.data.slicesIndex === undefined
    ) {
      // set default
      index = Math.floor(slicesIndexMax * 0.5);
    } else {
      index = slicesIndexMax * this.data.slicesIndex;
    }

    this._lastStackOrientationIndex = stackOrientationIndex;

    // brightness
    const windowCenterMax: number = this.state.stackhelper.stack.minMax[1];
    const windowCenter: number = Math.floor(
      Utils.reverseNumber(
        windowCenterMax * this.data.slicesWindowCenter,
        0,
        windowCenterMax
      )
    );

    // contrast
    const windowWidthMax: number =
      this.state.stackhelper.stack.minMax[1] -
      this.state.stackhelper.stack.minMax[0];
    const windowWidth: number = Math.floor(
      Utils.reverseNumber(
        windowWidthMax * this.data.slicesWindowWidth,
        0,
        windowWidthMax
      )
    );

    // update the stackhelper
    (this.state
      .stackhelper as AMI.StackHelper).orientation = displayOrientationIndex;
    (this.state.stackhelper as AMI.StackHelper).index = index;
    (this.state
      .stackhelper as AMI.StackHelper).slice.windowCenter = windowCenter;
    (this.state.stackhelper as AMI.StackHelper).slice.windowWidth = windowWidth;
  },

  updateVolumeStack(): void {
    if (!this.state.stackhelper) {
      return;
    }

    // brightness
    const windowCenterMax: number = this.state.stackhelper.stack.minMax[1];
    const windowCenter: number = Math.floor(
      Utils.reverseNumber(
        windowCenterMax * this.data.volumeWindowCenter,
        0,
        windowCenterMax
      )
    );

    // contrast
    const windowWidthMax: number =
      this.state.stackhelper.stack.minMax[1] -
      this.state.stackhelper.stack.minMax[0];
    const windowWidth: number = Math.floor(
      Utils.reverseNumber(
        windowWidthMax * this.data.volumeWindowWidth,
        0,
        windowWidthMax
      )
    );

    // update the stackhelper
    (this.state
      .stackhelper as AMI.VolumeRenderHelper).windowCenter = windowCenter;
    (this.state
      .stackhelper as AMI.VolumeRenderHelper).windowWidth = windowWidth;
  },

  // tslint:disable-next-line: no-any
  update(oldData: any): void {
    const state = this.state;
    const el = this.el;

    if (!this.data.src) {
      return;
    }

    if (oldData && oldData.src !== this.data.src) {
      // loading
      this.loader.load(this.data.src, el).then(stack => {
        this.handleStack(stack);
      });
    } else if (
      oldData &&
      oldData.displayMode !== this.data.displayMode &&
      state.stack
    ) {
      // switching display mode
      this.removeEventListeners();
      this.handleStack(state.stack);
      this.addEventListeners();

      // if in volume mode, create a buffer texture
      if (this.data.displayMode === DisplayMode.VOLUME) {
        this.createBufferTexture();
        // allow some time for the stackhelper to update
        setTimeout(() => {
          this.state.renderSteps = this.getRenderSteps();
        }, 800);
      } else {
        (this.el.sceneEl.object3D as THREE.Scene).background = null;
      }
    }

    switch (this.data.displayMode) {
      case DisplayMode.SLICES: {
        this.updateSlicesStack();
        break;
      }
      case DisplayMode.VOLUME: {
        this.updateVolumeStack();

        // if the controls type has changed, re-render the buffer scene
        if (
          oldData &&
          oldData.controlsType &&
          oldData.controlsType !== this.data.controlsType
        ) {
          this.state.renderSteps = this.getRenderSteps();
        }

        // if the volumeWindowCenter changed
        if (
          oldData &&
          oldData.volumeWindowCenter &&
          oldData.volumeWindowCenter !== this.data.volumeWindowCenter
        ) {
          this.state.debounce = true;
          this.state.stackhelper.stack.windowCenter = this.data.volumeWindowCenter;
          this.state.renderSteps = this.getRenderSteps();
        }

        // if the volumeWindowWidth changed
        if (
          oldData &&
          oldData.volumeWindowWidth &&
          oldData.volumeWindowWidth !== this.data.volumeWindowWidth
        ) {
          this.state.debounce = true;
          this.state.stackhelper.stack.windowWidth = this.data.volumeWindowWidth;
          this.state.renderSteps = this.getRenderSteps();
        }

        break;
      }
      default: {
        break;
      }
    }
  },

  tickFunction(): void {
    if (!this.state.stackhelper) {
      return;
    }

    if (this.data.displayMode === DisplayMode.SLICES) {
      this.el.setObject3D("mesh", this.state.stackhelper);
    }

    if (this.state.renderSteps > 0 && !this.state.debounce) {
      this.renderBufferScene();
    }
  },

  tick() {
    this.tickFunction();
  },

  remove(): void {
    if (this.data.displayMode === DisplayMode.SLICES) {
      this.el.removeObject3D("mesh");
    }
    this.removeEventListeners();

    (this.el.sceneEl.object3D as THREE.Scene).background = null;
  }
} as AlVolumeComponent);
