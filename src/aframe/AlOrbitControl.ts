import {
  AframeRegistry,
  AframeComponent,
  AlOrbitControlState
} from "../interfaces/interfaces";
import { Constants } from "../Constants";

export class AlOrbitControl implements AframeRegistry {
  public static getObject(): AframeComponent {
    return {
      dependencies: ["camera"],

      schema: {
        startPosition: { type: "vec3" },
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
        targetRadius: { type: "number", default: 1 }
      },
      init() {
        this.onEnterVR = this.onEnterVR.bind(this);
        this.onExitVR = this.onExitVR.bind(this);

        let el = this.el;
        let oldPosition = new THREE.Vector3();
        let controls = new THREE.OrbitControls(
          el.getObject3D("camera"),
          el.sceneEl.renderer.domElement
        );
        let target = new THREE.Vector3();

        el.sceneEl.addEventListener("enter-vr", this.onEnterVR);
        el.sceneEl.addEventListener("exit-vr", this.onExitVR);

        document.body.style.cursor = "grab";
        document.addEventListener("mousedown", () => {
          document.body.style.cursor = "grabbing";
        });
        document.addEventListener("mouseup", () => {
          document.body.style.cursor = "grab";
        });

        let splashBackGeom = new THREE.PlaneGeometry(1, 1, 1, 1);
        let splashBackMaterial = new THREE.MeshBasicMaterial();
        let splashBackMesh = new THREE.Mesh(splashBackGeom, splashBackMaterial);

        //this.el.setObject3D("mesh", splashBackMesh);

        el.setAttribute("position", this.data.startPosition);

        const lookPos = el.getAttribute("position");
        const direction: THREE.Vector3 = lookPos
          .clone()
          .sub(this.data.target)
          .normalize();
        const splashPos = direction.multiplyScalar(-this.data.targetRadius);
        const scaleN = this.data.targetRadius * Constants.splashBackSize;

        splashBackMesh.scale.copy(new THREE.Vector3(scaleN, scaleN, scaleN));
        splashBackMesh.position.copy(splashPos);

        this.state = {
          controls,
          oldPosition,
          target,
          splashBackMesh,
          splashBackGeom,
          splashBackMaterial
        } as AlOrbitControlState;

        el.emit(
          "controls-init",
          {
            controls: this.state.controls,
            splashBack: this.state.splashBackMesh
          },
          true
        );
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

        const direction: THREE.Vector3 = this.el
          .getAttribute("position")
          .clone()
          .sub(this.data.target)
          .normalize();
        const splashPos = direction.multiplyScalar(-this.data.targetRadius);
        const scaleN = this.data.targetRadius * Constants.splashBackSize;

        state.splashBackMesh.scale.copy(
          new THREE.Vector3(scaleN, scaleN, scaleN)
        );
        state.splashBackMesh.position.copy(splashPos);
      },

      tick() {
        let state = this.state as AlOrbitControlState;
        let el = this.el;
        let controls = state.controls;
        const data = this.data;

        if (!data.enabled) {
          return;
        }
        if (
          controls.enabled &&
          (controls.enableDamping || controls.autoRotate)
        ) {
          controls.update();

          const lookPos = controls.object.position;
          const direction: THREE.Vector3 = lookPos
            .clone()
            .sub(state.target)
            .normalize();
          const splashPos = direction.multiplyScalar(-data.targetRadius);

          el.setAttribute("position", lookPos);
          (state.splashBackMesh as THREE.Mesh).lookAt(lookPos);
          state.splashBackMesh.position.copy(splashPos);
        }
      },

      remove() {
        let state = this.state as AlOrbitControlState;

        //this.el.removeObject3D("mesh");
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
