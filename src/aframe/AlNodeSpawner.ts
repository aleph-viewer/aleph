import { AframeRegistry, AframeComponent } from "../interfaces";
import { AlNodeEvents } from ".";
import { Constants } from "../Constants";
import { ThreeUtils } from "../utils";
import { AlGraphEvents } from "../utils/GraphUtils";

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
  pointerOver(event: CustomEvent): void;
  pointerOut(event: CustomEvent): void;
  elClick(event: CustomEvent): void;
  pointerDown(event: CustomEvent): void;
  pointerUp(event: CustomEvent): void;
}

export class AlNodeSpawner implements AframeRegistry {
  public static get Object(): AlNodeSpawnerObject {
    return {
      dependencies: ["raycaster"],

      schema: {
        graphEnabled: { type: "boolean" }
      },

      bindListeners() {
        this.canvasMouseDown = this.canvasMouseDown.bind(this);
        this.pointerOver = this.pointerOver.bind(this);
        this.pointerOut = this.pointerOut.bind(this);
        this.elClick = this.elClick.bind(this);
        this.canvasMouseUp = this.canvasMouseUp.bind(this);
        this.pointerDown = this.pointerDown.bind(this);
        this.pointerUp = this.pointerUp.bind(this);
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
        this.el.addEventListener("raycaster-intersected", this.pointerOver, {
          capture: false,
          once: false,
          passive: true
        });
        this.el.addEventListener(
          "raycaster-intersected-cleared",
          this.pointerOut,
          false
        );
        this.el.addEventListener("click", this.elClick, {
          capture: false,
          once: false,
          passive: true
        });
        this.el.addEventListener("mousedown", this.pointerDown, {
          capture: false,
          once: false,
          passive: true
        });
        this.el.addEventListener("mouseup", this.pointerUp, {
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
        this.el.removeEventListener("raycaster-intersected", this.pointerOver);
        this.el.removeEventListener(
          "raycaster-intersected-cleared",
          this.pointerOut
        );
        this.el.removeEventListener("click", this.elClick);
        this.el.removeEventListener("mousedown", this.pointerDown);
        this.el.removeEventListener("mouseup", this.pointerUp);
      },

      canvasMouseDown(event: MouseEvent) {
        this.state.left = event.button === 0;
      },

      canvasMouseUp(_event: MouseEvent) {
        ThreeUtils.waitOneFrame(() => {
          this.state.left = false;
        });
      },

      pointerOver(_event: CustomEvent) {
        this.state.intersecting = true;
        this.el.sceneEl.emit(
          AlNodeSpawnerEvents.VALID_TARGET,
          { valid: true },
          false
        );
      },

      pointerOut(_event: CustomEvent) {
        this.state.intersecting = false;
        this.el.sceneEl.emit(
          AlNodeSpawnerEvents.VALID_TARGET,
          { valid: false },
          false
        );
      },

      pointerDown(_event: CustomEvent) {
        if (this.data.graphEnabled) {
          //console.log("spawner-emit: ", AlNodeEvents.CONTROLS_DISABLED);
          this.el.sceneEl.emit(AlGraphEvents.POINTER_DOWN, {}, false);
        }
      },

      pointerUp(_event: CustomEvent) {
        if (this.data.graphEnabled) {
          //console.log("spawner-emit: ", AlNodeEvents.CONTROLS_ENABLED);
          this.el.sceneEl.emit(AlGraphEvents.POINTER_UP, {}, false);
        }
      },

      elClick(event: CustomEvent) {
        if (this.state.left && this.data.graphEnabled) {
          //console.log("spawner-emit: ", AlNodeSpawnerEvents.ADD_NODE);
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

  public static get Tag(): string {
    return "al-node-spawner";
  }
}

export class AlNodeSpawnerEvents {
  static VALID_TARGET: string = "al-valid-target";
  static ADD_NODE: string = "al-add-node";
}
