import { AframeRegistry, AframeComponent, AlCameraSerial } from "../interfaces";
import { Constants } from "../Constants";
import { ThreeUtils } from "../utils";
import { AlNodeSpawnerEvents, AlNodeEvents, AlCameraControllerEvents } from ".";

interface AlOrbitControlState {
  controls: THREE.OrbitControls;
  animationStates: AlCameraSerial[];
  step: number;
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
  sceneCameraChanged(): void;
}

export class AlOrbitControl implements AframeRegistry {
  public static get Object(): AlOrbitControlObject {
    return {
      dependencies: ["camera"],

      schema: {
        animating: { type: "boolean", default: false },
        animationPosition: { type: "vec3" },
        animationTarget: { type: "vec3" },
        autoRotate: { type: "boolean" },
        autoRotateSpeed: { default: 2 },
        controlsPosition: { type: "vec3" },
        controlsTarget: { type: "vec3" },
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
        zoomSpeed: { type: "number", default: 0.5 }
      },

      bindListeners() {
        this.canvasMouseUp = this.canvasMouseUp.bind(this);
        this.canvasMouseDown = this.canvasMouseDown.bind(this);
        this.canvasWheel = this.canvasWheel.bind(this);
        this.emitNewSerial = this.emitNewSerial.bind(this);
        this.sceneCameraChanged = this.sceneCameraChanged.bind(this);
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
          AlCameraControllerEvents.UPDATED,
          this.sceneCameraChanged,
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
          AlCameraControllerEvents.UPDATED,
          this.sceneCameraChanged,
          false
        );
      },

      sceneCameraChanged() {
        let state = this.state;
        let controls = state.controls as THREE.OrbitControls;
        let temp = {
          autoRotate: controls.autoRotate,
          autoRotateSpeed: controls.autoRotateSpeed,
          dampingFactor: controls.dampingFactor,
          enabled: controls.enabled,
          enableDamping: controls.enableDamping,
          enableKeys: controls.enableKeys,
          enablePan: controls.enablePan,
          enableRotate: controls.enableRotate,
          enableZoom: controls.enableZoom,
          keyPanSpeed: controls.keyPanSpeed,
          maxAzimuthAngle: controls.maxAzimuthAngle,
          maxDistance: controls.maxDistance,
          maxPolarAngle: controls.maxPolarAngle,
          minAzimuthAngle: controls.minAzimuthAngle,
          minDistance: controls.minDistance,
          minPolarAngle: controls.minPolarAngle,
          rotateSpeed: controls.rotateSpeed,
          screenSpacePanning: controls.screenSpacePanning,
          zoomSpeed: controls.zoomSpeed,

          position: controls.object.position,
          target: controls.target
        };

        let newControls = new THREE.OrbitControls(
          this.el.sceneEl.camera,
          this.el.sceneEl.renderer.domElement
        );

        newControls.autoRotate = temp.autoRotate;
        newControls.autoRotateSpeed = temp.autoRotateSpeed;
        newControls.dampingFactor = temp.dampingFactor;
        newControls.enabled = temp.enabled;
        newControls.enableDamping = temp.enableDamping;
        newControls.enableKeys = temp.enableKeys;
        newControls.enablePan = temp.enablePan;
        newControls.enableRotate = temp.enableRotate;
        newControls.enableZoom = temp.enableZoom;
        newControls.keyPanSpeed = temp.keyPanSpeed;
        newControls.maxPolarAngle = temp.maxPolarAngle;
        newControls.maxAzimuthAngle = temp.maxAzimuthAngle;
        newControls.maxDistance = temp.maxDistance;
        newControls.minDistance = temp.minDistance;
        newControls.minPolarAngle = temp.minPolarAngle;
        newControls.minAzimuthAngle = temp.minAzimuthAngle;
        newControls.rotateSpeed = temp.rotateSpeed;
        newControls.screenSpacePanning = temp.screenSpacePanning;
        newControls.zoomSpeed = temp.zoomSpeed;
        newControls.object.position.copy(temp.position);
        newControls.target.copy(temp.target);

        this.state.controls.dispose();
        this.state.controls = newControls;

        this.state.controls.object.name = "controls-newCamera";

        this.emitNewSerial();
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
        this.canvasWheel = window.setTimeout(() => {
          this.emitNewSerial();
        }, Constants.minFrameMS);
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
          el.sceneEl.camera,
          el.sceneEl.renderer.domElement
        );

        controls.object.name = "controls-init";
        console.log("al-orbit-controls-init: ", controls.object.name);

        // Convert the controlsPosition & controlsTarget Objects into THREE.Vector3
        let controlsPosition = ThreeUtils.objectToVector3(
          data.controlsPosition
        );
        let controlsTarget = ThreeUtils.objectToVector3(data.controlsTarget);

        controls.object.position.copy(controlsPosition);
        el.sceneEl.camera.position.copy(controlsPosition);
        controls.target.copy(controlsTarget);

        (this.state as AlOrbitControlState) = {
          controls,
          animationStates: [],
          step: Constants.maxAnimationSteps
        };

        this.bindListeners();
        this.addListeners();

        // wait a frame before emitting initialised event
        window.setTimeout(() => {
          this.emitNewSerial();
        }, Constants.minFrameMS);
      },

      update(_oldData) {
        let controls = this.state.controls;
        const data = this.data;

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

        if (_oldData.animating !== data.animating) {
          if (data.animating) {
            this.state.step = 0;
            const animationTarget = ThreeUtils.objectToVector3(
              data.animationTarget
            );
            const animationPosition = ThreeUtils.objectToVector3(
              data.animationPosition
            );

            const diffPos: number = animationPosition.distanceTo(
              controls.object.position
            );
            const diffTarg: number = animationTarget.distanceTo(
              controls.target
            );

            for (let step = 1; step <= Constants.maxAnimationSteps; step++) {
              let percent = step / Constants.maxAnimationSteps;
              let newPos = new THREE.Vector3().copy(controls.object.position);
              let newTarg = new THREE.Vector3().copy(controls.target);

              if (diffPos) {
                newPos = ThreeUtils.slerp(
                  controls.object.position.clone(),
                  animationPosition.clone(),
                  percent
                );
              }
              if (diffTarg) {
                newTarg = ThreeUtils.slerp(
                  controls.target.clone(),
                  animationTarget.clone(),
                  percent
                );
              }

              this.state.animationStates.push({
                position: newPos,
                target: newTarg
              } as AlCameraSerial);
            }

            this.state.step = 0;
          }
        } else {
          this.state.animating = data.animating;
          controls.target = ThreeUtils.objectToVector3(data.controlsTarget);
          this.el.sceneEl.camera.position.copy(
            ThreeUtils.objectToVector3(data.controlsPosition)
          );
        }

        console.log("al-orbit-controls-update: ", controls.object.name);
      },

      tickFunction() {
        let state = this.state;
        let controls = state.controls;
        if (!controls.enabled) {
          return;
        }

        if (state.step < Constants.maxAnimationSteps && this.data.animating) {
          console.log("step: ", state.step);
          state.controls.object.position.copy(
            state.animationStates[state.step].position
          );
          state.controls.target.copy(state.animationStates[state.step].target);
          state.step += 1;
          controls.update();

          if (state.step == Constants.maxAnimationSteps) {
            this.emitNewSerial();
            this.el.sceneEl.emit(
              AlOrbitControlEvents.ANIMATION_FINISHED,
              {},
              false
            );
            state.animationStates = [];
          }
        } else if (
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
        this.removeListeners();
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
  static ANIMATION_FINISHED: string = "al-orbit-control-animation-finished";
}
