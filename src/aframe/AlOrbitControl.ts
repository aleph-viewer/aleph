import { AframeRegistry, AframeComponent, AlCameraSerial } from "../interfaces";
import { Constants } from "../Constants";
import { ThreeUtils } from "../utils";
import { AlNodeSpawnerEvents, AlNodeEvents } from ".";

interface AlOrbitControlState {
  controls: THREE.OrbitControls;
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
}

export class AlOrbitControl implements AframeRegistry {
  public static getObject(): AlOrbitControlObject {
    return {
      dependencies: ["camera"],

      schema: {
        autoRotate: { type: "boolean" },
        autoRotateSpeed: { default: 2 },
        cameraPosition: { type: "vec3" },
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
        minZoom: { default: 0 },
        panSpeed: { default: 1 },
        rotateSpeed: { default: 0.05 },
        screenSpacePanning: { default: false },
        targetPosition: { type: "vec3" },
        zoomSpeed: { type: "number", default: 0.5 }
      },

      bindListeners() {
        this.canvasMouseUp = this.canvasMouseUp.bind(this);
        this.canvasMouseDown = this.canvasMouseDown.bind(this);
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
      },

      canvasMouseUp(_event: MouseEvent) {
        document.body.style.cursor = "grab";
        let controls = this.state.controls;

        if (controls.enabled) {
          let res = {
            position: controls.object.position,
            target: controls.target
          } as AlCameraSerial;

          this.el.sceneEl.emit(AlOrbitControlEvents.UPDATED, res, false);
        }
      },

      canvasMouseDown(_event: MouseEvent) {
        document.body.style.cursor = "grabbing";
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

        // Convert the cameraPosition & targetPosition Objects into THREE.Vector3
        let cameraPosition = ThreeUtils.objectToVector3(data.cameraPosition);
        let targetPosition = ThreeUtils.objectToVector3(data.targetPosition);

        //controls.object.position.copy(cameraPosition);
        el.getObject3D("camera").position.copy(cameraPosition);
        controls.target.copy(targetPosition);

        (this.state as AlOrbitControlState) = { controls };

        this.bindListeners();
        this.addListeners();

        // wait a frame before emitting initialised event
        setTimeout(() => {
          let res = {
            position: controls.object.position,
            target: controls.target
          } as AlCameraSerial;
          this.el.sceneEl.emit(AlOrbitControlEvents.UPDATED, res, false);
        }, Constants.minFrameMS);
      },

      update(_oldData) {
        let controls = this.state.controls;
        const data = this.data;

        console.log("orbit-controls-top: ", data.enabled);

        controls.target = ThreeUtils.objectToVector3(data.targetPosition);
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
          .position.copy(ThreeUtils.objectToVector3(data.cameraPosition));

        console.log("orbit-controls-bot: ", controls.enabled);

        // // If _oldData.cameraPosition exists and we're NOT cameraAnimating, this is not the initialisation update and an animation update
        // if (_oldData.cameraPosition) {
        //   let oldPos = ThreeUtils.objectToVector3(_oldData.cameraPosition);
        //   let newPos = ThreeUtils.objectToVector3(data.cameraPosition);

        //   if (!oldPos.equals(newPos)) {
        //     // Check the old start position against the value passed in by aleph._renderCamera()
        //     // This is to check and see if the source has changed, as the cameraPosition for each
        //     // source is determined by it's bounding sphere.
        //     state.cameraPosition.copy(newPos);

        //     if (!data.cameraAnimating) {
        //       controls.object.position.copy(state.cameraPosition);
        //       state.positionCache.copy(state.cameraPosition);
        //     }
        //   }
        // }
        // console.log("controls-update:", this.state.controls.object.position);
      },

      tickFunction() {
        //console.log("controls-update: enabled:", this.data.enabled);
        // let state = this.state as AlOrbitControlState;
        let controls = this.state.controls;
        if (!controls.enabled) {
          return;
        }
        // let el = this.el;
        // const data = this.data;

        // if (!this.data.enabled) {
        //   return;
        // }

        // if (data.cameraAnimating) {
        //   //console.log("controls-update: animating ", data.animating);
        //   let endPos = state.cameraPosition;
        //   let startPos = state.positionCache;

        //   if (state.animationStep <= Constants.maxAnimationSteps) {
        //     const percent: number =
        //       state.animationStep / Constants.maxAnimationSteps;
        //     const res: THREE.Vector3 | null = ThreeUtils.slerp(
        //       startPos.clone(),
        //       endPos.clone(),
        //       percent
        //     );

        //     if (res) {
        //       controls.object.position.copy(res);
        //       state.animationStep += 1;
        //     } else {
        //       el.sceneEl.emit(AlOrbitControlEvents.ANIMATION_FINISHED, {}, true);
        //       state.animationStep = 0;
        //     }
        //   } else {
        //     el.sceneEl.emit(AlOrbitControlEvents.ANIMATION_FINISHED, {}, true);
        //     state.animationStep = 0;
        //   }
        // }
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

  public static getName(): string {
    return "al-orbit-control";
  }
}

export class AlOrbitControlEvents {
  static UPDATED: string = "al-orbit-controls-updated";
}
