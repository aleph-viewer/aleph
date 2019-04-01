import { AframeRegistry, AframeComponent } from "../interfaces";
import { AlNodeEvents } from ".";
import { Constants } from "../Constants";

interface AlNodeSpawnerState {
  left: boolean;
  intersecting: boolean;
}

interface AlNodeSpawnerObject extends AframeComponent {
  dependencies: string[];
  bindListeners(): void;
  addListeners(): void;
  removeListeners(): void;
  remove(): void;
  canvasMouseDown(event: MouseEvent): void;
  canvasMouseUp(event: MouseEvent): void;
  elRaycasterIntersected(event: CustomEvent): void;
  elRaycasterIntersectedCleared(event: CustomEvent): void;
  elClick(event: CustomEvent): void;
  elMouseDown(event: CustomEvent): void;
  elMouseUp(event: CustomEvent): void;
}

export class AlNodeSpawner implements AframeRegistry {
  public static getObject(): AlNodeSpawnerObject {
    return {
      dependencies: ["raycaster"],

      schema: {
        nodesEnabled: { type: "boolean" }
      },

      bindListeners() {
        this.canvasMouseDown = this.canvasMouseDown.bind(this);
        this.elRaycasterIntersected = this.elRaycasterIntersected.bind(this);
        this.elRaycasterIntersectedCleared = this.elRaycasterIntersectedCleared.bind(
          this
        );
        this.elClick = this.elClick.bind(this);
        this.canvasMouseUp = this.canvasMouseUp.bind(this);
        this.elMouseDown = this.elMouseDown.bind(this);
        this.elMouseUp = this.elMouseUp.bind(this);
      },

      addListeners() {
        this.el.sceneEl.canvas.addEventListener(
          "mousedown",
          this.canvasMouseDown,
          { capture: false, once: false, passive: true }
        );
        this.el.sceneEl.canvas.addEventListener("mouseup", this.canvasMouseUp, {
          capture: false,
          once: false,
          passive: true
        });
        this.el.addEventListener(
          "raycaster-intersected",
          this.elRaycasterIntersected,
          { capture: false, once: false, passive: true }
        );
        this.el.addEventListener(
          "raycaster-intersected-cleared",
          this.elRaycasterIntersectedCleared,
          false
        );
        this.el.addEventListener("click", this.elClick, {
          capture: false,
          once: false,
          passive: true
        });
        this.el.addEventListener("mousedown", this.elMouseDown, {
          capture: false,
          once: false,
          passive: true
        });
        this.el.addEventListener("mouseup", this.elMouseUp, {
          capture: false,
          once: false,
          passive: true
        });
      },

      removeListeners() {
        this.el.sceneEl.canvas.removeEventListener(
          "mousedown",
          this.canvasMouseDown
        );
        this.el.sceneEl.canvas.removeEventListener(
          "mouseup",
          this.canvasMouseUp
        );
        this.el.removeEventListener(
          "raycaster-intersected",
          this.elRaycasterIntersected
        );
        this.el.removeEventListener(
          "raycaster-intersected-cleared",
          this.elRaycasterIntersectedCleared
        );
        this.el.removeEventListener("click", this.elClick);
        this.el.removeEventListener("mousedown", this.elMouseDown);
        this.el.removeEventListener("mouseup", this.elMouseUp);
      },

      canvasMouseDown(event: MouseEvent) {
        this.state.left = event.button === 0;
      },

      canvasMouseUp(_event: MouseEvent) {
        window.setTimeout(() => {
          this.state.left = false;
        }, Constants.minFrameMS);
      },

      elRaycasterIntersected(_event: CustomEvent) {
        this.state.intersecting = true;
        this.el.sceneEl.emit(
          AlNodeSpawnerEvents.VALID_TARGET,
          { valid: true },
          false
        );
      },

      elRaycasterIntersectedCleared(_event: CustomEvent) {
        this.state.intersecting = false;
        this.el.sceneEl.emit(
          AlNodeSpawnerEvents.VALID_TARGET,
          { valid: false },
          false
        );
      },

      elMouseDown(_event: CustomEvent) {
        if (this.data.nodesEnabled) {
          this.el.sceneEl.emit(AlNodeEvents.CONTROLS_DISABLED, {}, false);
        }
      },

      elMouseUp(_event: CustomEvent) {
        if (this.data.nodesEnabled) {
          this.el.sceneEl.emit(AlNodeEvents.CONTROLS_ENABLED, {}, false);
        }
      },

      elClick(event: CustomEvent) {
        if (this.state.left && this.data.nodesEnabled) {
          this.el.sceneEl.emit(AlNodeSpawnerEvents.ADD_NODE, event, false);
        }
      },

      init(): void {
        this.bindListeners();
        this.addListeners();

        this.state = {
          left: false,
          intersecting: false
        } as AlNodeSpawnerState;
      },

      remove(): void {
        this.removeListeners();
      }
    } as AlNodeSpawnerObject;
  }

  public static getName(): string {
    return "al-node-spawner";
  }
}

export class AlNodeSpawnerEvents {
  static VALID_TARGET: string = "al-valid-target";
  static ADD_NODE: string = "al-add-node";
}
