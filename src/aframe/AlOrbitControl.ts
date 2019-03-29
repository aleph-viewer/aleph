import { AframeRegistry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";
import { ThreeUtils } from "../utils";

interface AlOrbitControlState {
  oldPosition: THREE.Vector3;
  controls: THREE.OrbitControls;
  targetPosition: THREE.Vector3;
  cameraPosition: THREE.Vector3;
  positionCache: THREE.Vector3;
  animationStep: number;
}

interface AlOrbitControlObject extends AframeComponent {
  dependencies: string[];
  onEnterVR: () => void;
  onExitVR: () => void;
  update(_oldData): void;
  tickFunction(): void;
  tick(): void;
  remove(): void;
  bindListeners(): void;
  addListeners(): void;
  removeListeners(): void;
  canvasMouseUp(event: MouseEvent): void;
  canvasMouseDown(event: MouseEvent): void;
}

export class AlOrbitControl implements AframeRegistry {
  public static getObject(): AlOrbitControlObject {
    return {
      dependencies: ["camera"],

      schema: {
        cameraPosition: { type: "vec3" },
        autoRotate: { type: "boolean" },
        autoRotateSpeed: { default: 2 },
        dampingFactor: { default: 0.1 },
        enabled: { default: true },
        enableDamping: { default: true },
        enableKeys: { default: true },
        enablePan: { default: true },
        enableRotate: { default: true },
        enableZoom: { default: true },
        keyPanSpeed: { default: 7 },
        minAzimuthAngle: { type: "number", default: -Infinity },
        maxAzimuthAngle: { type: "number", default: Infinity },
        maxDistance: { default: 1000 },
        maxPolarAngle: { default: AFRAME.utils.device.isMobile() ? 90 : 120 },
        minDistance: { default: 1 },
        minPolarAngle: { default: 0 },
        minZoom: { default: 0 },
        panSpeed: { default: 1 },
        rotateSpeed: { default: 0.05 },
        screenSpacePanning: { default: false },
        targetPosition: { type: "vec3" },
        zoomSpeed: { type: "number", default: 0.5 },
        boundingRadius: { type: "number", default: 1 },
        cameraAnimating: { type: "boolean", default: false }
      },

      bindListeners() {
        this.onEnterVR = this.onEnterVR.bind(this);
        this.onExitVR = this.onExitVR.bind(this);
        this.canvasMouseUp = this.canvasMouseUp.bind(this);
        this.canvasMouseDown = this.canvasMouseDown.bind(this);
      },

      addListeners() {
        this.el.sceneEl.addEventListener("enter-vr", this.onEnterVR);
        this.el.sceneEl.addEventListener("exit-vr", this.onExitVR);
        this.el.sceneEl.canvas.addEventListener("mouseup", this.canvasMouseUp);
        this.el.sceneEl.canvas.addEventListener(
          "mousedown",
          this.canvasMouseDown
        );
      },

      removeListeners() {
        this.el.sceneEl.removeEventListener("enter-vr", this.onEnterVR);
        this.el.sceneEl.removeEventListener("exit-vr", this.onExitVR);
        this.el.sceneEl.canvas.removeEventListener(
          "mouseup",
          this.canvasMouseUp
        );
        this.el.sceneEl.canvas.removeEventListener(
          "mousedown",
          this.canvasMouseDown
        );
      },
      onEnterVR() {
        if (
          !AFRAME.utils.device.checkHeadsetConnected() &&
          !AFRAME.utils.device.isMobile()
        ) {
          return;
        }

        let state = this.state as AlOrbitControlState;
        let el = this.el;

        state.controls.enabled = false;
        if (el.hasAttribute("look-controls")) {
          el.setAttribute("look-controls", "enabled", true);
          state.oldPosition.copy(el.getObject3D("camera").position);
          el.getObject3D("camera").position.set(0, 0, 0);
        }
      },
      onExitVR() {
        if (
          !AFRAME.utils.device.checkHeadsetConnected() &&
          !AFRAME.utils.device.isMobile()
        ) {
          return;
        }

        let state = this.state as AlOrbitControlState;
        let el = this.el;

        state.controls.enabled = true;
        el.getObject3D("camera").position.copy(state.oldPosition);
        if (el.hasAttribute("look-controls")) {
          el.setAttribute("look-controls", "enabled", false);
        }
      },

      canvasMouseUp(_event: MouseEvent) {
        document.body.style.cursor = "grab";
        this.el.emit(
          AlOrbitControlEvents.HAS_MOVED,
          {
            position: this.state.controls.object.position,
            target: this.state.controls.target
          },
          true
        );
      },

      canvasMouseDown(_event: MouseEvent) {
        document.body.style.cursor = "grabbing";
      },

      init() {
        this.tickFunction = AFRAME.utils.throttle(
          this.tickFunction,
          Constants.minFrameMS,
          this
        );

        let el = this.el;
        let oldPosition = new THREE.Vector3();
        let controls = new THREE.OrbitControls(
          el.getObject3D("camera"),
          el.sceneEl.renderer.domElement
        );
        let data = this.data;

        document.body.style.cursor = "grab";

        // Convert the cameraPosition & targetPosition Objects into THREE.Vector3
        let cameraPosition = ThreeUtils.objectToVector3(data.cameraPosition);
        let targetPosition = ThreeUtils.objectToVector3(data.targetPosition);

        (this.state as AlOrbitControlState) = {
          controls,
          oldPosition,
          targetPosition,
          cameraPosition,
          animationStep: 0,
          positionCache: cameraPosition
        };

        controls.object.position.copy(cameraPosition);

        this.bindListeners();
        this.addListeners();

        // wait a frame before emitting initialised event
        setTimeout(() => {
          this.el.emit(
            AlOrbitControlEvents.INITIALISED,
            {
              position: this.state.controls.object.position,
              target: this.state.controls.target
            },
            true
          );
        }, Constants.minFrameMS);
      },

      update(_oldData) {
        let state = this.state as AlOrbitControlState;
        let controls = state.controls;
        const data = this.data;

        controls.target = state.targetPosition.copy(data.targetPosition);
        controls.autoRotate = data.autoRotate;
        controls.autoRotateSpeed = data.autoRotateSpeed;
        controls.dampingFactor = data.dampingFactor;
        controls.enabled = data.enabled;
        console.log("controls-update: ", data.enabled);
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

        // If _oldData.cameraPosition exists and we're NOT cameraAnimating, this is not the initialisation update and an animation update
        if (_oldData.cameraPosition) {
          let oldPos = ThreeUtils.objectToVector3(_oldData.cameraPosition);
          let newPos = ThreeUtils.objectToVector3(data.cameraPosition);

          if (!oldPos.equals(newPos)) {
            // Check the old start position against the value passed in by aleph._renderCamera()
            // This is to check and see if the source has changed, as the cameraPosition for each
            // source is determined by it's bounding sphere.
            state.cameraPosition.copy(newPos);

            if (!data.cameraAnimating) {
              controls.object.position.copy(state.cameraPosition);
              state.positionCache.copy(state.cameraPosition);
              console.log("controls-update: ", state.cameraPosition);
            }
          }
        }
      },

      tickFunction() {
        if (!this.data.enabled) {
          return;
        }

        let state = this.state as AlOrbitControlState;
        let el = this.el;
        let controls = state.controls;
        const data = this.data;

        if (data.cameraAnimating) {
          let endPos = state.cameraPosition;
          let startPos = state.positionCache;

          if (state.animationStep <= Constants.maxAnimationSteps) {
            const percent: number =
              state.animationStep / Constants.maxAnimationSteps;
            const res: THREE.Vector3 | null = ThreeUtils.slerp(
              startPos.clone(),
              endPos.clone(),
              percent
            );

            if (res) {
              controls.object.position.copy(res);
              state.animationStep += 1;
            } else {
              el.emit(AlOrbitControlEvents.ANIMATION_FINISHED, {}, true);
              state.animationStep = 0;
            }
          } else {
            el.emit(AlOrbitControlEvents.ANIMATION_FINISHED, {}, true);
            state.animationStep = 0;
          }
        }
        controls.update();
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

  public static getName(): string {
    return "al-orbit-control";
  }
}

export class AlOrbitControlEvents {
  static ANIMATION_FINISHED: string = "al-animation-finished";
  static HAS_MOVED: string = "al-has-moved";
  static INITIALISED: string = "al-controls-initialised";
}
