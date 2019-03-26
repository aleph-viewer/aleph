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
        inPosition: { type: "vec3" },
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
        target: { type: "vec3" },
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
        //#endregion

        //#region Positioning
        // Set Camera Element position to be at the start position
        el.setAttribute("position", data.inPosition);

        // Convert the inPosition & target Objects into THREE.Vector3 s
        let inPosition = new THREE.Vector3();
        inPosition.x = data.inPosition.x;
        inPosition.y = data.inPosition.y;
        inPosition.z = data.inPosition.z;

        let target = new THREE.Vector3();
        target.x = data.target.x;
        target.y = data.target.y;
        target.z = data.target.z;

        // Get the direction of the Camera from the target (Start -> Target)
        const direction: THREE.Vector3 = inPosition
          .clone()
          .sub(target.clone())
          .normalize();
        const splashPos = direction.multiplyScalar(this.data.boundingRadius);
        const scaleN = this.data.boundingRadius * Constants.splashBackSize;
        //#endregion

        splashBackMesh.scale.copy(new THREE.Vector3(scaleN, scaleN, scaleN));
        splashBackMesh.position.copy(splashPos);
        splashBackMesh.lookAt(inPosition);

        (this.state as AlOrbitControlState) = {
          controls,
          oldPosition,
          target,
          splashBackMesh,
          splashBackGeom,
          splashBackMaterial,
          inPosition,
          animating: data.animating,
          animationStep: 0,
          animationStart: new THREE.Vector3(0, 0, 0)
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

        controls.target = state.target.copy(data.target);
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

        // If _oldData.inPosition exists and we're NOT animating, this is not the initialisation update and an animation update
        if (_oldData.inPosition) {
          if (data.animating) {
            state.animationStart = controls.object.position;
          } else if (
            _oldData.inPosition.x !== data.inPosition.x ||
            _oldData.inPosition.y !== data.inPosition.y ||
            _oldData.inPosition.z !== data.inPosition.z
          ) {
            // Check the old start position against the value passed in by aleph._renderCamera()
            // This is to check and see if the source has changed, as the inPosition for each
            // source is determined by it's bounding sphere.
            state.inPosition = data.inPosition;
            el.setAttribute("position", data.inPosition);
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
          controls.update();
          let endPos = new THREE.Vector3();
          endPos.x = state.inPosition.x;
          endPos.y = state.inPosition.y;
          endPos.z = state.inPosition.z;
          let startPos = state.animationStart;

          if (state.animationStep < Constants.dollySteps) {
            const percent: number = state.animationStep / Constants.dollySteps;
            console.log(percent);
            const res: THREE.Vector3 = ThreeUtils.slerp(
              startPos,
              endPos,
              percent
            );
            controls.object.position.copy(res);
            el.setAttribute("position", ThreeUtils.vector3ToString(res));
            //console.log(el.getAttribute("position"), " : ", res);
            state.animationStep += 1;
          }
        } else if (
          controls.enabled &&
          (controls.enableDamping || controls.autoRotate)
        ) {
          controls.update();
          const lookPos = controls.object.position;
          let target = new THREE.Vector3();
          target.x = state.target.x;
          target.y = state.target.y;
          target.z = state.target.z;

          const direction: THREE.Vector3 = lookPos
            .clone()
            .sub(target.clone())
            .normalize();
          const splashPos = direction.multiplyScalar(-data.boundingRadius);
          const scaleN = data.boundingRadius * Constants.splashBackSize;

          state.splashBackMesh.scale.copy(
            new THREE.Vector3(scaleN, scaleN, scaleN)
          );
          state.splashBackMesh.position.copy(splashPos);
          state.splashBackMesh.lookAt(lookPos);
          el.setAttribute("position", lookPos);

          // Reset animation step
          state.animationStep = 0;
        }
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
