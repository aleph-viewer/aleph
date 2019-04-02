import { AframeRegistry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";

interface AlCameraState {
  perspective: THREE.PerspectiveCamera;
  orthographic: THREE.OrthographicCamera;
}

interface AlCameraObject extends AframeComponent {
  update(oldData): void;
  updateActiveCamera(oldData): void;
  remove(): void;
}

export class AlCamera implements AframeRegistry {
  public static get Object(): AlCameraObject {
    return {
      schema: {
        active: { default: true },
        zoom: { default: 1, min: 0 },
        type: { default: "perspective" }
      },

      init() {
        let el = this.el;

        let perspective = new THREE.PerspectiveCamera(
          Constants.cameraValues.fov,
          window.innerWidth / window.innerHeight,
          Constants.cameraValues.near,
          Constants.cameraValues.far
        );
        let orthographic = new THREE.OrthographicCamera(
          window.innerWidth / -2,
          window.innerWidth / 2,
          window.innerHeight / 2,
          window.innerHeight / -2,
          Constants.cameraValues.near,
          Constants.cameraValues.far
        );

        this.state = {
          perspective,
          orthographic
        } as AlCameraState;

        el.setObject3D("camera", this.state.perspective);
      },

      update(oldData) {
        let data = this.data;

        let perspective = this.state.perspective;
        perspective.aspect =
          data.aspect || window.innerWidth / window.innerHeight;
        perspective.far = Constants.cameraValues.far;
        perspective.fov = Constants.cameraValues.fov;
        perspective.near = Constants.cameraValues.near;
        perspective.zoom = data.zoom;
        perspective.updateProjectionMatrix();

        let orthographic = this.state.orthographic;
        orthographic.left = window.innerWidth / -2;
        orthographic.right = window.innerWidth / 2;
        orthographic.top = window.innerHeight / 2;
        orthographic.bottom = window.innerHeight / -2;
        orthographic.near = Constants.cameraValues.near;
        orthographic.far = Constants.cameraValues.far;
        orthographic.zoom = data.zoom;
        orthographic.updateProjectionMatrix();

        if (oldData && oldData.type !== data.type) {
          this.el.removeObject3D("camera");

          if (data.type === "orthographic") {
            this.el.setObject3D("camera", this.state.orthographic);
          } else {
            this.el.setObject3D("camera", this.state.perspective);
          }
        }

        this.updateActiveCamera(oldData);
      },

      updateActiveCamera(oldData) {
        var data = this.data;
        var el = this.el;
        var system = this.system;

        // Active property did not change.
        if ((oldData && oldData.active === data.active) || data.spectator) {
          return;
        }

        // If `active` property changes, or first update, handle active camera with system.
        if (data.active && system.activeCameraEl !== el) {
          // Camera enabled. Set camera to this camera.
          system.setActiveCamera(el);
        } else if (!data.active && system.activeCameraEl === el) {
          // Camera disabled. Set camera to another camera.
          system.disableActiveCamera();
        }
      },

      remove: function() {
        this.el.removeObject3D("camera");
      }
    } as AlCameraObject;
  }
  public static get Tag(): string {
    return "al-camera";
  }
}
