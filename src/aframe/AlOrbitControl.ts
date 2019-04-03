import { AframeRegistry, AframeComponent, AlCameraSerial } from "../interfaces";
import { Constants } from "../Constants";
import { ThreeUtils } from "../utils";
import { AlNodeSpawnerEvents, AlNodeEvents } from ".";

interface AlOrbitControlState {
  controls: THREE.OrbitControls;
  animationCache: AlCameraSerial[];
}

interface AlOrbitControlObject extends AframeComponent {
  dependencies: string[];
  update(_oldData): void;
  tickFunction(): void;
  tick(): void;
  remove(): void;
  bindListeners(): void;
  addListeners(): void;
  removeListeners(): void;
  canvasMouseUp(event: MouseEvent): void;
  canvasMouseDown(event: MouseEvent): void;
  canvasWheel(event: WheelEvent): void;
  emitNewSerial(): void;
  catchAnimationCache(event: CustomEvent): void;
}

export class AlOrbitControl implements AframeRegistry {
  public static get Object(): AlOrbitControlObject {
    return {
      dependencies: ["camera"],

      schema: {
        autoRotate: { type: "boolean" },
        autoRotateSpeed: { default: 2 },
        controlPosition: { type: "vec3" },
        dampingFactor: { default: 0.1 },
        enabled: { default: true },
        enableDamping: { default: true },
        enableKeys: { default: true },
        enablePan: { default: true },
        enableRotate: { default: true },
        enableZoom: { default: true },
        keyPanSpeed: { default: 7 },
        maxAzimuthAngle: { type: "number", default: Infinity },
        maxDistance: { default: 1000 },
        maxPolarAngle: { default: AFRAME.utils.device.isMobile() ? 90 : 120 },
        minAzimuthAngle: { type: "number", default: -Infinity },
        minDistance: { default: 1 },
        minPolarAngle: { default: 0 },
        rotateSpeed: { default: 0.05 },
        screenSpacePanning: { default: false },
        controlTarget: { type: "vec3" },
        zoomSpeed: { type: "number", default: 0.5 },
        animating: { type: "boolean", default: false }
      },

      bindListeners() {
        this.canvasMouseUp = this.canvasMouseUp.bind(this);
        this.canvasMouseDown = this.canvasMouseDown.bind(this);
        this.canvasWheel = this.canvasWheel.bind(this);
        this.emitNewSerial = this.emitNewSerial.bind(this);
        this.catchAnimationCache = this.catchAnimationCache.bind(this);
      },

      addListeners() {
        this.el.sceneEl.canvas.addEventListener("mouseup", this.canvasMouseUp, {
          capture: false,
          once: false,
          passive: true
        });
        this.el.sceneEl.canvas.addEventListener(
          "mousedown",
          this.canvasMouseDown,
          { capture: false, once: false, passive: true }
        );
        this.el.sceneEl.canvas.addEventListener("wheel", this.canvasWheel, {
          capture: false,
          once: false,
          passive: true
        });
        this.el.sceneEl.addEventListener(
          AlOrbitControlEvents.ANIMATION_STARTED,
          this.catchAnimationCache,
          false
        );
      },

      removeListeners() {
        this.el.sceneEl.canvas.removeEventListener(
          "mouseup",
          this.canvasMouseUp
        );
        this.el.sceneEl.canvas.removeEventListener(
          "mousedown",
          this.canvasMouseDown
        );
        this.el.sceneEl.canvas.removeEventListener("wheel", this.canvasWheel);
        this.el.sceneEl.removeEventListener(
          AlOrbitControlEvents.ANIMATION_STARTED,
          this.catchAnimationCache,
          false
        );
      },

      catchAnimationCache(event: CustomEvent) {
        this.state.animationCache = event.detail.cache;
      },

      emitNewSerial() {
        let res = {
          position: this.state.controls.object.position,
          target: this.state.controls.target
        } as AlCameraSerial;

        this.el.sceneEl.emit(
          AlOrbitControlEvents.UPDATED,
          { cameraSerial: res },
          false
        );
      },

      canvasMouseUp(_event: MouseEvent) {
        document.body.style.cursor = "grab";
        let controls = this.state.controls;

        if (controls.enabled) {
          this.emitNewSerial();
        }
      },

      canvasMouseDown(_event: MouseEvent) {
        document.body.style.cursor = "grabbing";
      },

      canvasWheel(_event: WheelEvent) {
        window.clearTimeout(this.canvasWheel);
        this.canvasWheel = ThreeUtils.waitOneFrame(() => {
          this.emitNewSerial();
        });
      },

      init() {
        let el = this.el;
        let data = this.data;
        document.body.style.cursor = "grab";

        this.tickFunction = AFRAME.utils.throttle(
          this.tickFunction,
          Constants.minFrameMS,
          this
        );

        let controls = new THREE.OrbitControls(
          el.getObject3D("camera"),
          el.sceneEl.renderer.domElement
        );

        // Convert the controlPosition & controlTarget Objects into THREE.Vector3
        let controlPosition = ThreeUtils.objectToVector3(data.controlPosition);
        let controlTarget = ThreeUtils.objectToVector3(data.controlTarget);

        controls.object.position.copy(controlPosition);
        el.getObject3D("camera").position.copy(controlPosition);
        controls.target.copy(controlTarget);

        let animationCache = [];

        (this.state as AlOrbitControlState) = {
          controls,
          animationCache
        };

        this.bindListeners();
        this.addListeners();

        // wait a frame before emitting initialised event
        ThreeUtils.waitOneFrame(() => {
          this.emitNewSerial();
        });
      },

      update(_oldData) {
        let controls = this.state.controls;
        const data = this.data;

        controls.target = ThreeUtils.objectToVector3(data.controlTarget);
        controls.autoRotate = data.autoRotate;
        controls.autoRotateSpeed = data.autoRotateSpeed;
        controls.dampingFactor = data.dampingFactor;
        controls.enabled = data.enabled;
        controls.enableDamping = data.enableDamping;
        controls.enableKeys = data.enableKeys;
        controls.enablePan = data.enablePan;
        controls.enableRotate = data.enableRotate;
        controls.enableZoom = data.enableZoom;
        controls.keyPanSpeed = data.keyPanSpeed;
        controls.maxPolarAngle = THREE.Math.degToRad(data.maxPolarAngle);
        controls.maxAzimuthAngle = THREE.Math.degToRad(data.maxAzimuthAngle);
        controls.maxDistance = data.maxDistance;
        controls.minDistance = data.minDistance;
        controls.minPolarAngle = THREE.Math.degToRad(data.minPolarAngle);
        controls.minAzimuthAngle = THREE.Math.degToRad(data.minAzimuthAngle);
        controls.rotateSpeed = data.rotateSpeed;
        controls.screenSpacePanning = data.screenSpacePanning;
        controls.zoomSpeed = data.zoomSpeed;
        this.el
          .getObject3D("camera")
          .position.copy(ThreeUtils.objectToVector3(data.controlPosition));
      },

      tickFunction() {
        let controls = this.state.controls;
        if (!controls.enabled) {
          return;
        }

        if (this.data.animating) {
          let nextFrame: AlCameraSerial = this.state.animationCache.shift();

          // todo: should we be storing a velocity and accelerating to the next
          // point using the timeDelta?

          controls.object.position.copy(nextFrame.position);
          this.el.getObject3D("camera").position.copy(nextFrame.position);
          controls.target.copy(nextFrame.target);

          if (this.state.animationCache.length === 0) {
            this.el.sceneEl.emit(
              AlOrbitControlEvents.ANIMATION_FINISHED,
              {},
              false
            );
          }
        }

        if (
          controls.enabled &&
          (controls.enableDamping || controls.autoRotate)
        ) {
          controls.update();
        }
      },

      tick() {
        this.tickFunction();
      },

      remove() {
        this.removeEventListener();
        let state = this.state as AlOrbitControlState;
        state.controls.dispose();
        state = null;
      }
    } as AlOrbitControlObject;
  }

  public static get Tag(): string {
    return "al-orbit-control";
  }
}

export class AlOrbitControlEvents {
  static UPDATED: string = "al-orbit-controls-updated";
  static ANIMATION_STARTED: string = "al-orbit-controls-animation-started";
  static ANIMATION_FINISHED: string = "al-orbit-controls-animation-finished";
}
