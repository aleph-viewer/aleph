import { ComponentDefinition } from "aframe";
import { Constants } from "../../Constants";
import { AlCamera } from "../../interfaces";
import { ThreeUtils } from "../../utils";

interface AlControlState {
  animationCache: AlCamera[];
  // tslint:disable-next-line: no-any
  controls: THREE.OrbitControls | THREE.TrackballControls;
  mouseDown: boolean;
  wheelCounter1: number;
  wheelCounter2: number;
  wheelInterval: number;
  wheelMarker: boolean;
}

export class AlControlEvents {
  public static INTERACTION: string = "al-control-interaction";
  public static INTERACTION_FINISHED: string =
    "al-controls-interaction-finished";
  public static ANIMATION_STARTED: string = "al-controls-animation-started";
  public static ANIMATION_FINISHED: string = "al-controls-animation-finished";
}

interface AlControlComponent extends ComponentDefinition {
  dependencies: string[];
  tickFunction(): void;
  mouseUp(event: MouseEvent): void;
  mouseDown(event: MouseEvent): void;
  mouseMove(event: MouseEvent): void;
  canvasWheel(event: WheelEvent): void;
  onWheel(): void;
  handleAnimationCache(event: CustomEvent): void;
}

export default AFRAME.registerComponent("al-control", {
  dependencies: ["camera"],

  schema: {
    animating: { type: "boolean", default: false },
    controlPosition: { type: "vec3" },
    controlTarget: { type: "vec3" },
    enabled: { default: true },
    enablePan: { default: true },
    enableRotate: { default: true },
    enableZoom: { default: true },
    maxDistance: { default: 8000 },
    minDistance: { default: 1 },
    o_autoRotateautoRotate: { type: "boolean" },
    o_autoRotateSpeed: { default: 2 },
    o_dampingFactor: { default: 0.1 },
    o_enableDamping: { default: true },
    o_enableKeys: { default: true },
    o_keyPanSpeed: { default: 7 },
    o_maxAzimuthAngle: { type: "number", default: Infinity },
    o_maxPolarAngle: { default: 88 },
    o_minAzimuthAngle: { type: "number", default: -Infinity },
    o_minPolarAngle: { default: 0 },
    o_screenSpacePanning: { default: false },
    rotateSpeed: { default: 0.05 },
    zoomSpeed: { type: "number", default: 0.5 },
    isTrackballControls: { type: "boolean", default: true }
  },

  bindMethods() {
    this.makeControls = this.makeControls.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.canvasWheel = this.canvasWheel.bind(this);
    this.getCameraState = this.getCameraState.bind(this);
    this.handleAnimationCache = this.handleAnimationCache.bind(this);
    this.onWheel = this.onWheel.bind(this);
  },

  addListeners() {
    window.addEventListener("mouseup", this.mouseUp, {
      capture: false,
      once: false,
      passive: true
    });
    window.addEventListener("mousemove", this.mouseMove, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.sceneEl.canvas.addEventListener("mousedown", this.mouseDown, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.sceneEl.canvas.addEventListener("wheel", this.canvasWheel, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.sceneEl.addEventListener(
      AlControlEvents.ANIMATION_STARTED,
      this.handleAnimationCache,
      false
    );
  },

  removeListeners() {
    window.removeEventListener("mouseup", this.mouseUp);
    window.removeEventListener("mousemove", this.mouseMove),
      this.el.sceneEl.canvas.removeEventListener("mousedown", this.mouseDown);
    this.el.sceneEl.canvas.removeEventListener("wheel", this.canvasWheel);
    this.el.sceneEl.removeEventListener(
      AlControlEvents.ANIMATION_STARTED,
      this.handleAnimationCache,
      false
    );
  },

  handleAnimationCache(event: CustomEvent) {
    this.state.animationCache = event.detail.slerpPath;
  },

  mouseUp(_event: MouseEvent) {
    this.state.mouseDown = false;
    document.body.style.cursor = "grab";
    const controls = this.state.controls;

    if (controls.enabled) {
      this.el.sceneEl.emit(
        AlControlEvents.INTERACTION_FINISHED,
        { cameraState: this.getCameraState() },
        false
      );
    }
  },

  mouseDown(_event: MouseEvent) {
    this.state.mouseDown = true;
    document.body.style.cursor = "grabbing";
  },

  mouseMove(_event: MouseEvent) {
    if (this.state.mouseDown) {
      this.el.sceneEl.emit(
        AlControlEvents.INTERACTION,
        { cameraState: this.getCameraState() },
        false
      );
    }
  },

  onWheel() {
    const state = this.state;

    state.wheelMarker = false;
    state.wheelCounter2 = state.wheelCounter1;

    setTimeout(() => {
      if (state.wheelCounter2 === state.wheelCounter1) {
        state.wheelMarker = true;
        state.wheelCounter1 = 0;
        state.wheelCounter2 = 0;
        this.el.sceneEl.emit(
          AlControlEvents.INTERACTION_FINISHED,
          { cameraState: this.getCameraState() },
          false
        );
      } else {
        this.onWheel();
      }
    }, state.wheelInterval);
  },

  canvasWheel(_event: WheelEvent) {
    const state = this.state;

    state.wheelCounter1 += 1;

    if (state.wheelMarker) {
      this.onWheel();
    }

    this.el.sceneEl.emit(
      AlControlEvents.INTERACTION,
      { cameraState: this.getCameraState() },
      false
    );
  },

  init() {
    document.body.style.cursor = "grab";

    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      Constants.minFrameMS,
      this
    );

    (this.state as AlControlState) = {
      animationCache: [],
      controls: null,
      mouseDown: false,
      wheelCounter1: 0,
      wheelCounter2: undefined,
      wheelInterval: 50,
      wheelMarker: true
    };

    this.makeControls();
    this.bindMethods();
    this.addListeners();

    // wait a frame before emitting initialised event
    ThreeUtils.waitOneFrame(() => {
      this.el.sceneEl.emit(
        AlControlEvents.INTERACTION,
        { cameraState: this.getCameraState() },
        false
      );
    });
  },

  getCameraState(): AlCamera {
    return {
      position: this.state.controls.object.position,
      target: this.state.controls.target
    } as AlCamera;
  },

  makeControls(): void {
    let controls;

    if (this.data.isTrackballControls) {
      // tslint:disable-next-line: no-any
      controls = new (THREE as any).TrackballControls(
        this.el.getObject3D("camera"),
        this.el.sceneEl.renderer.domElement
      );
    } else {
      // tslint:disable-next-line: no-any
      controls = new (THREE as any).OrbitControls(
        this.el.getObject3D("camera"),
        this.el.sceneEl.renderer.domElement
      );
    }

    // Convert the controlPosition & controlTarget Objects into THREE.Vector3
    const controlPosition = ThreeUtils.objectToVector3(
      this.data.controlPosition
    );
    const controlTarget = ThreeUtils.objectToVector3(this.data.controlTarget);

    controls.object.position.copy(controlPosition);
    this.el.getObject3D("camera").position.copy(controlPosition);
    controls.target.copy(controlTarget);

    (this.state as AlControlState).controls = controls;
  },

  // tslint:disable-next-line: no-any
  update(_oldData: any) {
    if (_oldData.isTrackballControls !== this.data.isTrackballControls) {
      this.makeControls();
    }

    const controls = this.state.controls;
    const data = this.data;

    if (!this.data.isTrackballControls) {
      controls.autoRotate = data.o_autoRotate;
      controls.autoRotateSpeed = data.o_autoRotateSpeed;
      controls.dampingFactor = data.o_dampingFactor;
      controls.enableDamping = data.o_enableDamping;
      controls.enableKeys = data.o_enableKeys;
      controls.keyPanSpeed = data.o_keyPanSpeed;
      controls.maxPolarAngle = THREE.Math.degToRad(data.o_maxPolarAngle);
      controls.maxAzimuthAngle = THREE.Math.degToRad(data.o_maxAzimuthAngle);
      controls.minPolarAngle = THREE.Math.degToRad(data.o_minPolarAngle);
      controls.minAzimuthAngle = THREE.Math.degToRad(data.o_minAzimuthAngle);
      controls.screenSpacePanning = data.o_screenSpacePanning;
    }

    controls.target = ThreeUtils.objectToVector3(data.controlTarget);
    controls.enabled = data.enabled;
    controls.enablePan = data.enablePan;
    controls.enableRotate = data.enableRotate;
    controls.enableZoom = data.enableZoom;
    controls.maxDistance = data.maxDistance;
    controls.minDistance = data.minDistance;
    controls.rotateSpeed = data.rotateSpeed;
    controls.zoomSpeed = data.zoomSpeed;

    this.el
      .getObject3D("camera")
      .position.copy(ThreeUtils.objectToVector3(data.controlPosition));
  },

  tickFunction() {
    const controls = this.state.controls;
    if (!controls.enabled) {
      return;
    }

    if (this.data.animating) {
      const nextFrame: AlCamera = this.state.animationCache.shift();

      if (nextFrame && nextFrame.position && nextFrame.target) {
        controls.object.position.copy(nextFrame.position);
        this.el.getObject3D("camera").position.copy(nextFrame.position);
        controls.target.copy(nextFrame.target);
        this.el.sceneEl.emit(
          AlControlEvents.INTERACTION,
          { cameraState: this.getCameraState() },
          false
        );
      }

      if (this.state.animationCache.length === 0) {
        this.el.sceneEl.emit(AlControlEvents.ANIMATION_FINISHED, {}, false);
        this.el.sceneEl.emit(
          AlControlEvents.INTERACTION_FINISHED,
          { cameraState: this.getCameraState() },
          false
        );
      }
    }

    if (controls.enabled && (controls.enableDamping || controls.autoRotate)) {
      controls.update();
    }
  },

  tick() {
    this.tickFunction();
  },

  remove() {
    this.removeListeners();
    let state = this.state as AlControlState;
    state.controls.dispose();
    state = null;
  }
} as AlControlComponent);
