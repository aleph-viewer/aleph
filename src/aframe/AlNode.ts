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

interface AlNodeObject extends AframeComponent {
  update(oldData): void;
  tickFunction(): void;
  tick(): void;
  remove(): void;
  bindListeners(): void;
  addListeners(): void;
  removeListeners(): void;
  elMouseDown(_event: CustomEvent): void;
  elMouseUp(_event: CustomEvent): void;
  elRaycasterIntersected(_event: CustomEvent): void;
  elRaycasterIntersectedCleared(_event: CustomEvent): void;
  canvasMouseDown(_event: MouseEvent): void;
  canvasMouseUp(_event: MouseEvent): void;
}

export class AlNode implements AframeRegistry {
  public static getObject(): AlNodeObject {
    return {
      schema: {
        target: { type: "vec3" },
        scale: { type: "number", default: 1 },
        selected: { type: "boolean" },
        nodesEnabled: { type: "boolean" }
      },

      bindListeners(): void {
        this.canvasMouseDown = this.canvasMouseDown.bind(this);
        this.canvasMouseUp = this.canvasMouseUp.bind(this);
        this.elMouseDown = this.elMouseDown.bind(this);
        this.elMouseUp = this.elMouseUp.bind(this);
        this.elRaycasterIntersected = this.elRaycasterIntersected.bind(this);
        this.elRaycasterIntersectedCleared = this.elRaycasterIntersectedCleared.bind(
          this
        );
      },

      addListeners(): void {
        this.el.sceneEl.canvas.addEventListener(
          "mousedown",
          this.canvasMouseDown
        );
        this.el.sceneEl.canvas.addEventListener("mouseup", this.canvasMouseUp);
        this.el.addEventListener("mousedown", this.elMouseDown);
        this.el.addEventListener("mouseup", this.elMouseUp);
        this.el.addEventListener(
          "raycaster-intersected",
          this.elRaycasterIntersected
        );
        this.el.addEventListener(
          "raycaster-intersected-cleared",
          this.elRaycasterIntersectedCleared
        );
      },

      removeListeners(): void {
        this.el.sceneEl.canvas.removeEventListener(
          "mousedown",
          this.canvasMouseDown
        );
        this.el.sceneEl.canvas.removeEventListener(
          "mouseup",
          this.canvasMouseUp
        );
        this.el.removeEventListener("mousedown", this.elMouseDown);
        this.el.removeEventListener("mouseup", this.elMouseUp);
        this.el.removeEventListener(
          "raycaster-intersected",
          this.elRaycasterIntersected
        );
        this.el.removeEventListener(
          "raycaster-intersected-cleared",
          this.elRaycasterIntersectedCleared
        );
      },

      elMouseDown(_event: CustomEvent): void {
        if (this.data.nodesEnabled) {
          let state = this.state as AlNodeState;
          state.mouseDown = true;
          this.el.emit(AlNodeEvents.CONTROLS_DISABLED, {}, true);
          this.el.emit(AlNodeEvents.SELECTED, { id: this.el.id }, true);
        }
      },

      elMouseUp(_event: CustomEvent): void {
        if (this.data.nodesEnabled) {
          let state = this.state as AlNodeState;
          state.dragging = false;
          state.mouseDown = false;
          this.el.emit(AlNodeEvents.CONTROLS_ENABLED), {}, true;
        }
      },

      elRaycasterIntersected(_event: CustomEvent): void {
        let state = this.state as AlNodeState;
        state.hovered = true;
        this.el.emit(AlNodeEvents.INTERSECTION, {}, true);
      },

      elRaycasterIntersectedCleared(_event: CustomEvent): void {
        let state = this.state as AlNodeState;
        state.hovered = false;
        if (state.mouseDown && state.selected) {
          state.dragging = true;
        }
        this.el.emit(AlNodeEvents.INTERSECTION_CLEARED, {}, true);
      },

      canvasMouseDown(event: MouseEvent) {
        let state = this.state as AlNodeState;
        if (state.selected) {
          console.log("node-shifting: ", event.shiftKey);
        }
      },

      canvasMouseUp(_event: MouseEvent) {},

      init(): void {
        this.tickFunction = AFRAME.utils.throttle(
          this.tickFunction,
          Constants.minTimeForCameraThrottle,
          this
        );
        this.bindListeners();
        this.addListeners();

        const data = this.data;
        let el = this.el;

        const camera = el.sceneEl.camera.el.object3DMap.camera;
        const geometry = new THREE.SphereGeometry(data.scale, 16, 16);
        let material = new THREE.MeshBasicMaterial();
        material.color = new THREE.Color(Constants.nodeColors.selected);
        const mesh = new THREE.Mesh(geometry, material);

        el.setObject3D("mesh", mesh);

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

      tickFunction(): void {
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

      tick() {
        this.tickFunction();
      },

      remove(): void {
        this.removeListeners();
        this.el.removeObject3D("mesh");
      }
    } as AlNodeObject;
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
