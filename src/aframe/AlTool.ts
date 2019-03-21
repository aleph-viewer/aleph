import {
  AframeComponent,
  AframeObject,
  AlToolState
} from "../interfaces/interfaces";
import { ThreeUtils } from "../utils/utils";
import { Constants } from "../Constants";

export class AlTool implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      dependencies: ["raycaster"],

      schema: {
        focusId: { type: "string", default: "#focusEntity" },
        scale: { type: "number", default: 1 },
        selected: { type: "boolean" }
      },

      init(): void {
        const camera = this.el.sceneEl.camera.el.object3DMap.camera;
        const focus = this.el.sceneEl.querySelector(this.data.focusId)
          .object3DMap.mesh;
        const geometry = new THREE.SphereGeometry(this.data.scale, 16, 16);
        let material = new THREE.MeshBasicMaterial();
        material.color = new THREE.Color(Constants.toolColors.selected);
        const mesh = new THREE.Mesh(geometry, material);

        this.el.setObject3D("mesh", mesh);

        //#region Event Listeners
        this.el.addEventListener("raycaster-intersection", evt => {
          console.log("tool-", this.el.id, "  intersected!");

          if (evt.detail.point) {
            this.el.setAttribute(
              "position",
              ThreeUtils.vector3ToString(evt.detail.point)
            );
          }
        });

        this.el.addEventListener("raycaster-intersection-cleared", _evt => {
          console.log("tool-", this.el.id, "  cleared intersect!");
        });

        this.el.addEventListener("mousedown", _evt => {
          console.log("tool-", this.el.id, "  mouse down!");

          let state = this.state as AlToolState;
          state.moving = true;
        });

        this.el.addEventListener("mouseup", _evt => {
          console.log("tool-", this.el.id, "  mouse up!");

          let state = this.state as AlToolState;
          state.moving = false;
        });

        this.el.addEventListener("click", _evt => {
          const id = this.el.getAttribute("id");
          this.el.emit("tool-selected", { id: id }, true);
        });

        this.el.addEventListener("raycaster-intersected", _evt => {
          let state = this.state as AlToolState;
          state.material.color = new THREE.Color(Constants.toolColors.hovered);
          state.hovered = true;
          this.el.emit("tool-intersection", {}, true);
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
          this.el.emit("tool-intersection-cleared", {}, true);
        });

        let object3D = this.el.object3D as THREE.Object3D;
        object3D.lookAt(focus.position);

        this.state = {
          selected: true,
          hovered: false,
          geometry,
          material,
          mesh,
          camera,
          focus,
          moving: false
        } as AlToolState;
      },

      update(): void {
        let state = this.state as AlToolState;
        let object3D = this.el.object3D as THREE.Object3D;
        object3D.lookAt(state.focus.position);

        state.focus = this.el.sceneEl.querySelector(
          this.data.focusId
        ).object3DMap.mesh;

        state.selected = this.data.selected;

        if (state.hovered) {
          state.material.color = new THREE.Color(Constants.toolColors.hovered);
        } else if (state.selected) {
          state.material.color = new THREE.Color(Constants.toolColors.selected);
        } else {
          state.material.color = new THREE.Color(Constants.toolColors.normal);
        }
      },

      tick(): void {},

      remove(): void {},

      pause(): void {},

      play(): void {}
    } as AframeObject;
  }

  public static getName(): string {
    return "al-tool";
  }
}
