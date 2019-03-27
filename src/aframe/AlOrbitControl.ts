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
        animating: { type: "boolean", default: false }
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

        el.sceneEl.addEventListener("mouseup", () => {
          this.state.controlPosition = this.state.controls.object.position;
          console.log("mouseup-control-position: ", this.state.controlPosition);
        });
        el.sceneEl.canvas.addEventListener("wheel", _evt => {
          window.clearTimeout(this.isWheeling);
          // Set a timeout to run after scrolling ends
          this.isWheeling = setTimeout(() => {
            this.state.controlPosition = this.state.controls.object.position;
            console.log("wheel-control-position: ", this.state.controlPosition);
          }, 50);
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
          animating: data.animating,
          animationStep: 0,
          controlPosition: new THREE.Vector3()
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

        // If _oldData.cameraPosition exists and we're NOT animating, this is not the initialisation update and an animation update
        if (_oldData.cameraPosition) {
          if (
            _oldData.cameraPosition.x !== data.cameraPosition.x ||
            _oldData.cameraPosition.y !== data.cameraPosition.y ||
            _oldData.cameraPosition.z !== data.cameraPosition.z
          ) {
            // Check the old start position against the value passed in by aleph._renderCamera()
            // This is to check and see if the source has changed, as the cameraPosition for each
            // source is determined by it's bounding sphere.
            state.cameraPosition = data.cameraPosition;
            el.setAttribute("position", data.cameraPosition);
          }
        }
      },

      tick() {
        let state = this.state as AlOrbitControlState;
        let el = this.el;
        let controls = state.controls;
        const data = this.data;

        if (!data.enabled) {
          return;
        }

        if (data.animating) {
          let endPos = new THREE.Vector3();
          endPos.x = state.cameraPosition.x;
          endPos.y = state.cameraPosition.y;
          endPos.z = state.cameraPosition.z;
          let startPos = state.controlPosition;
          console.log(
            "start: ",
            state.animationStep,
            ": [",
            startPos.x,
            ", ",
            startPos.y,
            ", ",
            startPos.z,
            "]"
          );
          if (state.animationStep <= Constants.maxAnimationSteps) {
            const percent: number =
              state.animationStep / Constants.maxAnimationSteps;
            const res: THREE.Vector3 = ThreeUtils.slerp(
              startPos,
              endPos,
              percent
            );
            console.log(
              "res: ",
              state.animationStep,
              ": [",
              res.x,
              ", ",
              res.y,
              ", ",
              res.z,
              "]"
            );
            el.setAttribute("position", ThreeUtils.vector3ToString(res));
            state.animationStep += 1;
          } else {
            el.emit(AlOrbitControlEvents.ANIMATION_FINISHED, {}, true);
          }

          controls.update();
        } else if (
          controls.enabled &&
          (controls.enableDamping || controls.autoRotate)
        ) {
          controls.update();
          // Reset animation step
          state.animationStep = 0;
        }

        const lookPos = controls.object.position;
        let targetPosition = new THREE.Vector3();
        targetPosition.x = state.targetPosition.x;
        targetPosition.y = state.targetPosition.y;
        targetPosition.z = state.targetPosition.z;

        const direction: THREE.Vector3 = lookPos
          .clone()
          .sub(targetPosition.clone())
          .normalize();
        const splashPos = direction.multiplyScalar(-data.boundingRadius);
        const scaleN = data.boundingRadius * Constants.splashBackSize;

        state.splashBackMesh.scale.copy(
          new THREE.Vector3(scaleN, scaleN, scaleN)
        );
        state.splashBackMesh.position.copy(splashPos);
        state.splashBackMesh.lookAt(lookPos);
        el.setAttribute("position", lookPos);
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
}
