import { AframeRegistry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";
import { ThreeUtils } from "../utils";

interface AlNodeState {
  selected: boolean;
  hovered: boolean;
  geometry: THREE.SphereGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  camera: THREE.Camera;
  target: THREE.Vector3;
  dragging: boolean;
  mouseDown: boolean;
  lastCameraPosition: THREE.Vector3;
}

export class AlNode implements AframeRegistry {
  public static getObject(): AframeComponent {
    return {
      schema: {
        target: { type: "vec3" },
        scale: { type: "number", default: 1 },
        selected: { type: "boolean" },
        nodesEnabled: { type: "boolean" }
      },

      init(): void {
        this.onEnterVR = this.onEnterVR.bind(this);
        this.onExitVR = this.onExitVR.bind(this);

        const data = this.data;
        let el = this.el;

        const camera = el.sceneEl.camera.el.object3DMap.camera;
        const geometry = new THREE.SphereGeometry(data.scale, 16, 16);
        let material = new THREE.MeshBasicMaterial();
        material.color = new THREE.Color(Constants.nodeColors.selected);
        const mesh = new THREE.Mesh(geometry, material);

        el.setObject3D("mesh", mesh);

        //#region Event Listeners
        el.addEventListener("mousedown", _evt => {
          if (this.data.nodesEnabled) {
            let state = this.state as AlNodeState;
            state.mouseDown = true;
            this.el.emit(AlNodeEvents.CONTROLS_DISABLED, {}, true);
            this.el.emit(AlNodeEvents.SELECTED, { id: this.el.id }, true);
          }
        });

        el.addEventListener("mouseup", _evt => {
          if (this.data.nodesEnabled) {
            let state = this.state as AlNodeState;
            state.dragging = false;
            state.mouseDown = false;
            this.el.emit(AlNodeEvents.CONTROLS_ENABLED), {}, true;
          }
        });

        el.addEventListener("raycaster-intersected", _evt => {
          let state = this.state as AlNodeState;
          state.hovered = true;
          this.el.emit(AlNodeEvents.INTERSECTION, {}, true);
        });

        el.addEventListener("raycaster-intersected-cleared", _evt => {
          let state = this.state as AlNodeState;
          state.hovered = false;
          if (state.mouseDown && state.selected) {
            state.dragging = true;
          }
          this.el.emit(AlNodeEvents.INTERSECTION_CLEARED, {}, true);
        });

        let targetPos = ThreeUtils.objectToVector3(data.target);

        let lookPos = new THREE.Vector3();
        lookPos.copy(camera.position);
        el.object3D.lookAt(lookPos);

        this.state = {
          selected: true,
          hovered: false,
          geometry,
          material,
          mesh,
          camera,
          target: targetPos,
          dragging: false,
          lastCameraPosition: lookPos
        } as AlNodeState;
      },

      update(): void {
        let state = this.state as AlNodeState;
        state.target = this.data.target;
        state.selected = this.data.selected;
      },

      tick(): void {
        let state = this.state as AlNodeState;
        if (this.data.nodesEnabled && state.dragging) {
          this.el.emit(AlNodeEvents.DRAGGING, { id: this.el.id }, true);
        }

        if (state.hovered || state.dragging) {
          state.material.color = new THREE.Color(Constants.nodeColors.hovered);
        } else if (state.selected) {
          state.material.color = new THREE.Color(Constants.nodeColors.selected);
        } else {
          state.material.color = new THREE.Color(Constants.nodeColors.normal);
        }

        if (!state.lastCameraPosition.equals(state.camera.position)) {
          const currentCameraPosition = state.camera.position;
          this.el.object3D.lookAt(currentCameraPosition);
          state.lastCameraPosition.copy(currentCameraPosition);
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
    return "al-node";
  }
}

export class AlNodeEvents {
  static SELECTED: string = "al-node-selected";
  static INTERSECTION: string = "al-node-intersection";
  static INTERSECTION_CLEARED: string = "al-node-intersection-cleared";
  static DRAGGING: string = "al-node-dragging";
  static CONTROLS_ENABLED: string = "al-control-enable";
  static CONTROLS_DISABLED: string = "al-control-disabled";
  static ANIMATION_STARTED: string = "al-animation-started";
}
