import {
  AframeRegistry,
  AframeComponent,
  AlOrbitControlState
} from "../interfaces";
import { Constants } from "../Constants";
import { ThreeUtils } from "../utils";

export class AlOrbitControl implements AframeRegistry {
  public static getObject(): AframeComponent {
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
      init() {
        //#region Bindings & Initialisation
        this.onEnterVR = this.onEnterVR.bind(this);
        this.onExitVR = this.onExitVR.bind(this);

        let el = this.el;
        let oldPosition = new THREE.Vector3();
        let controls = new THREE.OrbitControls(
          el.getObject3D("camera"),
          el.sceneEl.renderer.domElement
        );
        let data = this.data;

        //#region Mesh Creation
        let splashBackGeom = new THREE.PlaneGeometry(1, 1, 1, 1);
        let splashBackMaterial = new THREE.MeshBasicMaterial({
          wireframe: true
        });
        splashBackMaterial.side = THREE.DoubleSide;
        let splashBackMesh = new THREE.Mesh(splashBackGeom, splashBackMaterial);
        //#endregion

        //#endregion

        //#region Event Handlers
        el.sceneEl.addEventListener("enter-vr", this.onEnterVR);
        el.sceneEl.addEventListener("exit-vr", this.onExitVR);

        document.body.style.cursor = "grab";
        document.addEventListener("mousedown", () => {
          document.body.style.cursor = "grabbing";
        });
        document.addEventListener("mouseup", () => {
          document.body.style.cursor = "grab";
        });

        el.addEventListener("mouseup", () => {
          el.emit(
            AlOrbitControlEvents.HAS_MOVED,
            {
              position: controls.object.position,
              target: controls.target
            },
            true
          );

          console.log("lastPos: ", controls.object.position);
          console.log("lastTarg: ", controls.target);
        });
        //#endregion

        //#region Positioning
        // Set Camera Element position to be at the start position
        el.setAttribute("position", data.cameraPosition);

        // Convert the cameraPosition & targetPosition Objects into THREE.Vector3 s
        let cameraPosition = new THREE.Vector3();
        cameraPosition.x = data.cameraPosition.x;
        cameraPosition.y = data.cameraPosition.y;
        cameraPosition.z = data.cameraPosition.z;

        let targetPosition = new THREE.Vector3();
        targetPosition.x = data.targetPosition.x;
        targetPosition.y = data.targetPosition.y;
        targetPosition.z = data.targetPosition.z;

        // Get the direction of the Camera from the targetPosition (Start -> targetPosition)
        const direction: THREE.Vector3 = cameraPosition
          .clone()
          .sub(targetPosition.clone())
          .normalize();
        const splashPos = direction.multiplyScalar(this.data.boundingRadius);
        const scaleN = this.data.boundingRadius * Constants.splashBackSize;
        //#endregion

        splashBackMesh.scale.copy(new THREE.Vector3(scaleN, scaleN, scaleN));
        splashBackMesh.position.copy(splashPos);
        splashBackMesh.lookAt(cameraPosition);

        (this.state as AlOrbitControlState) = {
          controls,
          oldPosition,
          targetPosition,
          splashBackMesh,
          splashBackGeom,
          splashBackMaterial,
          cameraPosition,
          animationStep: 0,
          controlPosition: controls.object.position
        };

        // emit after 1 ms so that it happens after the scene's componentDidUpdate method has fired
        setTimeout(() => {
          el.emit(
            AlOrbitControlEvents.INIT,
            {
              controls: this.state.controls,
              splashBack: this.state.splashBackMesh
            },
            true
          );
        }, 10);
      },
      onEnterVR() {
        let state = this.state as AlOrbitControlState;
        let el = this.el;

        if (
          !AFRAME.utils.device.checkHeadsetConnected() &&
          !AFRAME.utils.device.isMobile()
        ) {
          return;
        }
        state.controls.enabled = false;
        if (el.hasAttribute("look-controls")) {
          el.setAttribute("look-controls", "enabled", true);
          state.oldPosition.copy(el.getObject3D("camera").position);
          el.getObject3D("camera").position.set(0, 0, 0);
        }
      },
      onExitVR() {
        let state = this.state as AlOrbitControlState;
        let el = this.el;

        if (
          !AFRAME.utils.device.checkHeadsetConnected() &&
          !AFRAME.utils.device.isMobile()
        ) {
          return;
        }
        state.controls.enabled = true;
        el.getObject3D("camera").position.copy(state.oldPosition);
        if (el.hasAttribute("look-controls")) {
          el.setAttribute("look-controls", "enabled", false);
        }
      },

      update(_oldData) {
        let state = this.state as AlOrbitControlState;
        let el = this.el;
        let controls = state.controls;
        const data = this.data;

        controls.target = state.targetPosition.copy(data.targetPosition);
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

        // If _oldData.cameraPosition exists and we're NOT cameraAnimating, this is not the initialisation update and an animation update
        if (_oldData.cameraPosition) {
          if (
            _oldData.cameraPosition.x !== data.cameraPosition.x ||
            _oldData.cameraPosition.y !== data.cameraPosition.y ||
            _oldData.cameraPosition.z !== data.cameraPosition.z
          ) {
            console.log("update: ", data.cameraPosition);
            console.log("updateTarg: ", controls.target);
            // Check the old start position against the value passed in by aleph._renderCamera()
            // This is to check and see if the source has changed, as the cameraPosition for each
            // source is determined by it's bounding sphere.
            state.cameraPosition.x = data.cameraPosition.x;
            state.cameraPosition.y = data.cameraPosition.y;
            state.cameraPosition.z = data.cameraPosition.z;
            if (!data.cameraAnimating) {
              el.setAttribute("position", data.cameraPosition);
            } else {
              state.controlPosition = state.controls.object.position;
            }
          }
        }
      },

      tick() {
        if (!this.data.enabled) {
          return;
        }

        let state = this.state as AlOrbitControlState;
        let el = this.el;
        let controls = state.controls;
        const data = this.data;

        if (data.cameraAnimating) {
          let endPos = state.cameraPosition;
          let startPos = state.controlPosition;

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
              el.setAttribute("position", ThreeUtils.vector3ToString(res));

              state.animationStep += 1;
            } else {
              el.emit(AlOrbitControlEvents.ANIMATION_FINISHED, {}, true);
              state.animationStep = 0;
            }
          } else {
            el.emit(AlOrbitControlEvents.ANIMATION_FINISHED, {}, true);
            state.animationStep = 0;
          }
        } else {
          el.setAttribute("position", controls.object.position);
        }

        controls.update();

        const direction: THREE.Vector3 = controls.object.position
          .clone()
          .sub(state.targetPosition.clone())
          .normalize();
        const splashPos = direction
          .clone()
          .multiplyScalar(-data.boundingRadius);
        state.splashBackMesh.position.copy(splashPos);
        state.splashBackMesh.lookAt(controls.object.position);
      },

      remove() {
        let state = this.state as AlOrbitControlState;

        this.el.sceneEl.object3D.remove(state.splashBackMesh);
        state.controls.reset();
        state.controls.dispose();
        state.splashBackMaterial.dispose();
        state.splashBackGeom.dispose();
        state.splashBackMesh = null;
        state = null;
        this.el.sceneEl.removeEventListener("enter-vr", this.onEnterVR);
        this.el.sceneEl.removeEventListener("exit-vr", this.onExitVR);
      },

      pause() {},

      play() {}
    } as AframeComponent;
  }

  public static getName(): string {
    return "al-orbit-control";
  }
}

export class AlOrbitControlEvents {
  static INIT: string = "al-controls-init";
  static ANIMATION_FINISHED: string = "al-animation-finished";
  static HAS_MOVED: string = "al-has-moved";
}
