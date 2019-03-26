import { AframeRegistry, AframeComponent, AlToolState } from "../interfaces";
import { Constants } from "../Constants";

export class AlTool implements AframeRegistry {
  public static getObject(): AframeComponent {
    return {
      schema: {
        target: { type: "vec3" },
        scale: { type: "number", default: 1 },
        selected: { type: "boolean" },
        toolsEnabled: { type: "boolean" },
        text: { type: "string" },
        textOffset: { type: "vec3" }
      },

      init(): void {
        this.onEnterVR = this.onEnterVR.bind(this);
        this.onExitVR = this.onExitVR.bind(this);

        const data = this.data;
        let el = this.el;

        const camera = el.sceneEl.camera.el.object3DMap.camera;
        const geometry = new THREE.SphereGeometry(data.scale, 16, 16);
        let material = new THREE.MeshBasicMaterial();
        material.color = new THREE.Color(Constants.toolColors.selected);
        const mesh = new THREE.Mesh(geometry, material);
        let textOffset = new THREE.Vector3();
        textOffset.x = data.textOffset.x;
        textOffset.y = data.textOffset.y;
        textOffset.z = data.textOffset.z;

        el.setObject3D("mesh", mesh);

        //#region Event Listeners
        el.addEventListener("mousedown", _evt => {
          if (this.data.toolsEnabled) {
            let state = this.state as AlToolState;
            state.mouseDown = true;
            this.el.emit(AlToolEvents.CONTROLS_DISABLED, {}, true);
            this.el.emit(AlToolEvents.SELECTED, { id: this.el.id }, true);
          }
        });

        el.addEventListener("mouseup", _evt => {
          if (this.data.toolsEnabled) {
            let state = this.state as AlToolState;
            state.dragging = false;
            state.mouseDown = false;
            this.el.emit(AlToolEvents.CONTROLS_ENABLED), {}, true;
          }
        });

        el.addEventListener("raycaster-intersected", _evt => {
          let state = this.state as AlToolState;
          state.hovered = true;
          this.el.emit(AlToolEvents.INTERSECTION, {}, true);
        });

        el.addEventListener("raycaster-intersected-cleared", _evt => {
          let state = this.state as AlToolState;
          state.hovered = false;
          if (state.mouseDown && state.selected) {
            state.dragging = true;
          }
          this.el.emit(AlToolEvents.INTERSECTION_CLEARED, {}, true);
        });

        let targetPos = new THREE.Vector3();
        targetPos.x = data.target.x;
        targetPos.y = data.target.y;
        targetPos.z = data.target.z;

        this.state = {
          selected: true,
          hovered: false,
          geometry,
          material,
          mesh,
          camera,
          target: targetPos,
          dragging: false,
          text: data.text,
          textOffset
        } as AlToolState;
      },

      update(): void {
        let state = this.state as AlToolState;
        state.target = this.data.target;
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
  static CONTROLS_ENABLED: string = "al-control-enable";
  static CONTROLS_DISABLED: string = "al-control-disabled";
  static ANIMATION_STARTED: string = "al-animation-started";
}
