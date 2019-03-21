import {
  AframeComponent,
  AframeObject,
  AlToolState
} from "../interfaces/interfaces";
import { RaycasterUtils, ThreeUtils } from "../utils/utils";
import { Constants } from "../Constants";

export class AlTool implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      //dependencies: ["raycaster"],

      schema: {
        focusId: { type: "string", default: "#focusEntity" },
        maxRayDistance: { type: "number", default: 1 },
        scale: { type: "number", default: 1 },
        selected: { type: "boolean" }
      },

      init(): void {
        const camera = this.el.sceneEl.camera.el.object3DMap.camera;
        const focus = this.el.sceneEl.querySelector(this.data.focusId)
          .object3DMap.mesh;
        const pos = this.el.getAttribute("position");
        const direction = pos
          .clone()
          .sub(focus.position)
          .normalize();

        const geometry = new THREE.SphereGeometry(this.data.scale, 16, 16);
        let material = new THREE.MeshBasicMaterial();
        material.color = new THREE.Color(Constants.toolColors.selected);
        const mesh = new THREE.Mesh(geometry, material);
        const raycaster = new THREE.Raycaster(pos, direction, 0, camera.far);

        this.el.setObject3D("mesh", mesh);

        //#region Event Listeners
        this.el.addEventListener("click", () => {
          // let state = this.state as AlToolState;
          // state.material.color = new THREE.Color(Constants.toolColors.selected);
          // state.selected = true;
          const id = this.el.getAttribute("id");
          this.el.emit("tool-selected", { id: id }, true);
        });

        this.el.addEventListener("raycaster-intersected", () => {
          let state = this.state as AlToolState;
          state.material.color = new THREE.Color(Constants.toolColors.hovered);
          state.hovered = true;
          this.el.emit("tool-intersection", {}, true);
        });

        this.el.addEventListener("raycaster-intersected-cleared", () => {
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

        this.el.addEventListener("mouseup", () => {
          let state = this.state as AlToolState;
          state.raycaster.far = this.maxRayDistance;

          const result = RaycasterUtils.castMeshRay(
            state.raycaster,
            state.focus
          );

          // If we hit something with the world raycast
          if (result) {
            this.el.setAttribute(
              "position",
              ThreeUtils.vector3ToString(result)
            );

            // Update the raycaster for next frame
            const pos = this.el.getAttribute("position");
            const direction = pos
              .clone()
              .sub(state.focus.position)
              .normalize();
            (state.raycaster as THREE.Raycaster).set(pos, direction);
          }
        });

        this.state = {
          selected: true,
          hovered: false,
          geometry,
          material,
          mesh,
          raycaster,
          camera,
          focus,
          maxRayDistance: this.data.maxRayDistance
        } as AlToolState;
      },

      update(): void {
        let state = this.state as AlToolState;

        let pos = this.el.getAttribute("position");
        let direction = pos
          .clone()
          .sub(state.focus.position)
          .normalize();
        state.raycaster.set(pos, direction);

        state.focus = this.el.sceneEl.querySelector(
          this.data.focusId
        ).object3DMap.mesh;

        state.selected = this.data.selected;
        state.maxRayDistance = this.data.maxRayDistance;

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
