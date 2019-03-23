import {
  AframeComponent,
  AframeObject,
  AlToolState
} from "../interfaces/interfaces";
import { Constants } from "../Constants";

export class AlTool implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      schema: {
        targetId: { type: "string", default: "#target-entity" },
        scale: { type: "number", default: 1 },
        selected: { type: "boolean" },
        toolsEnabled: { type: "boolean" }
      },

      init(): void {
        const camera = this.el.sceneEl.camera.el.object3DMap.camera;
        const target = this.el.sceneEl.querySelector(this.data.targetId)
          .object3DMap.mesh;
        const geometry = new THREE.SphereGeometry(this.data.scale, 16, 16);
        let material = new THREE.MeshBasicMaterial();
        material.color = new THREE.Color(Constants.toolColors.selected);
        const mesh = new THREE.Mesh(geometry, material);

        this.el.setObject3D("mesh", mesh);

        //#region Event Listeners
        this.el.addEventListener("mousedown", _evt => {
          if (this.data.toolsEnabled) {
            this.el.sceneEl.camera.el.setAttribute(
              "orbit-controls",
              "enabled: false"
            );
          }

          let state = this.state as AlToolState;
          state.moving = true;
          this.el.emit("tool-selected", { id: this.el.id }, true);
        });

        this.el.addEventListener("mouseup", _evt => {
          if (this.data.toolsEnabled) {
            this.el.sceneEl.camera.el.setAttribute(
              "orbit-controls",
              "enabled: true"
            );
          }
          let state = this.state as AlToolState;
          state.moving = false;
        });

        this.el.addEventListener("click", _evt => {
          this.el.emit("tool-selected", { id: this.el.id }, true);
        });

        this.el.addEventListener("raycaster-intersected", _evt => {
          let state = this.state as AlToolState;
          state.material.color = new THREE.Color(Constants.toolColors.hovered);
          state.hovered = true;
          this.el.emit("al-tool-intersection", {}, true);
        });

        this.el.addEventListener("raycaster-intersected-cleared", _evt => {
          let state = this.state as AlToolState;
          if (state.selected) {
            state.material.color = new THREE.Color(
              Constants.toolColors.selected
            );
          } else {
            state.material.color = new THREE.Color(Constants.toolColors.normal);
          }
          state.hovered = false;

          this.el.emit("al-tool-intersection-cleared", {}, true);
        });

        let object3D = this.el.object3D as THREE.Object3D;
        object3D.lookAt(target.position);

        this.state = {
          selected: true,
          hovered: false,
          geometry,
          material,
          mesh,
          camera,
          target,
          moving: false
        } as AlToolState;
      },

      update(): void {
        let state = this.state as AlToolState;
        let object3D = this.el.object3D as THREE.Object3D;
        object3D.lookAt(state.target.position);

        state.target = this.el.sceneEl.querySelector(
          this.data.targetId
        ).object3DMap.mesh;

        state.selected = this.data.selected;

        if (state.hovered || state.moving) {
          state.material.color = new THREE.Color(Constants.toolColors.hovered);
        } else if (state.selected) {
          state.material.color = new THREE.Color(Constants.toolColors.selected);
        } else {
          state.material.color = new THREE.Color(Constants.toolColors.normal);
        }
      },

      tick(): void {
        let state = this.state as AlToolState;
        if (state.moving && state.selected && this.data.toolsEnabled) {
          this.el.emit("tool-moved", { id: this.el.id }, true);
        }
      },

      remove(): void {
        this.el.removeObject3D("mesh");
      },

      pause(): void {},

      play(): void {},

      onEnterVR(): void {},

      onExitVR(): void {}
    } as AframeObject;
  }

  public static getName(): string {
    return "al-tool";
  }
}
