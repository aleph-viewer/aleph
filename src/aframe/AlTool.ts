import {
  AframeRegistry,
  AframeComponent,
  AlToolState
} from "../interfaces/interfaces";
import { Constants } from "../Constants";
import { AlOrbitControl } from "./aframe";

export class AlTool implements AframeRegistry {
  public static getObject(): AframeComponent {
    return {
      schema: {
        targetId: { type: "string", default: "#target-entity" },
        scale: { type: "number", default: 1 },
        selected: { type: "boolean" },
        toolsEnabled: { type: "boolean" }
      },

      init(): void {
        this.onEnterVR = this.onEnterVR.bind(this);
        this.onExitVR = this.onExitVR.bind(this);

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
            // todo: shouldn't be setting this here, emit an event and handle it in the main scene
            this.el.sceneEl.camera.el.setAttribute(
              AlOrbitControl.getName(),
              "enabled: false"
            );
          }

          this.state.mouseDown = true;
          this.el.emit(AlToolEvents.SELECTED, { id: this.el.id }, true);
        });

        this.el.addEventListener("mouseup", _evt => {
          if (this.data.toolsEnabled) {
            // todo: shouldn't be setting this here, emit an event and handle it in the main scene
            this.el.sceneEl.camera.el.setAttribute(
              AlOrbitControl.getName(),
              "enabled: true"
            );

            this.state.mouseDown = false;
            let state = this.state as AlToolState;
            state.dragging = false;
          }
        });

        this.el.addEventListener("raycaster-intersected", _evt => {
          let state = this.state as AlToolState;
          state.hovered = true;
          this.el.emit(AlToolEvents.INTERSECTION, {}, true);
        });

        this.el.addEventListener("raycaster-intersected-cleared", _evt => {
          let state = this.state as AlToolState;
          state.hovered = false;
          if (state.mouseDown) {
            state.dragging = true;
          }
          this.el.emit(AlToolEvents.INTERSECTION_CLEARED, {}, true);
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
          dragging: false
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
      },

      tick(): void {
        let state = this.state as AlToolState;
        if (this.data.toolsEnabled && state.dragging) {
          this.el.emit(AlToolEvents.DRAGGING, { id: this.el.id }, true);
        }

        if (state.hovered || state.dragging) {
          state.material.color = new THREE.Color(Constants.toolColors.hovered);
        } else if (state.selected) {
          state.material.color = new THREE.Color(Constants.toolColors.selected);
        } else {
          state.material.color = new THREE.Color(Constants.toolColors.normal);
        }
      },

      remove(): void {
        this.el.removeObject3D("mesh");
      },

      pause(): void {},

      play(): void {},

      onEnterVR(): void {},

      onExitVR(): void {}
    } as AframeComponent;
  }

  public static getName(): string {
    return "al-tool";
  }
}

export class AlToolEvents {
  static SELECTED: string = "al-tool-selected";
  static INTERSECTION: string = "al-tool-intersection";
  static INTERSECTION_CLEARED: string = "al-tool-intersection-cleared";
  static DRAGGING: string = "al-tool-dragging";
}
