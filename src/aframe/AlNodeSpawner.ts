import { AframeRegistry, AframeComponent } from "../interfaces";

interface AlNodeSpawnerState {
  left: boolean;
}

interface AlNodeSpawnerObject extends AframeComponent {
  dependencies: string[];
  bindListeners(): void;
  addListeners(): void;
  removeListeners(): void;
  remove(): void;
  canvasMouseDown(event: MouseEvent): void;
  canvasMouseUp(event: MouseEvent): void;
  elMouseDown(event: CustomEvent): void;
  elMouseUp(event: CustomEvent): void;
  elRaycasterIntersected(event: CustomEvent): void;
  elRaycasterIntersectedCleared(event: CustomEvent): void;
  elClick(event: CustomEvent): void;
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
        this.elMouseDown = this.elMouseDown.bind(this);
        this.elMouseUp = this.elMouseUp.bind(this);
        this.elRaycasterIntersected = this.elRaycasterIntersected.bind(this);
        this.elRaycasterIntersectedCleared = this.elRaycasterIntersectedCleared.bind(
          this
        );
        this.elClick = this.elClick.bind(this);
        this.canvasMouseUp = this.canvasMouseUp.bind(this);
      },

      addListeners() {
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
        this.el.addEventListener("click", this.elClick);
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
        this.el.removeEventListener("mousedown", this.elMouseDown);
        this.el.removeEventListener("mouseup", this.mouseup);
        this.el.removeEventListener(
          "raycaster-intersected",
          this.elRaycasterIntersected
        );
        this.el.removeEventListener(
          "raycaster-intersected-cleared",
          this.elRaycasterIntersectedCleared
        );
        this.el.removeEventListener("click", this.elClick);
      },

      canvasMouseDown(event: MouseEvent) {
        this.state.left = event.button === 0;
        console.log("spawner-shifting: ", event.shiftKey);
      },

      canvasMouseUp(_event: MouseEvent) {
        this.state.left = false;
      },

      elMouseDown(_event: CustomEvent) {
        if (this.data.nodesEnabled) {
          this.el.sceneEl.camera.el.setAttribute(
            "al-orbit-control",
            "enabled: false"
          );
        }
      },

      elMouseUp(_event: CustomEvent) {
        if (this.data.nodesEnabled) {
          this.el.sceneEl.camera.el.setAttribute(
            "al-orbit-control",
            "enabled: true"
          );
        }
      },

      elRaycasterIntersected(_event: CustomEvent) {
        this.el.emit(AlNodeSpawnerEvents.VALID_TARGET, { payload: true }, true);
      },

      elRaycasterIntersectedCleared(_event: CustomEvent) {
        this.el.emit(
          AlNodeSpawnerEvents.VALID_TARGET,
          { payload: false },
          true
        );
      },

      elClick(event: CustomEvent) {
        if (this.state.left) {
          this.el.emit(AlNodeSpawnerEvents.ADD_NODE, event, true);
          this.state.left = false;
        }
      },

      init(): void {
        this.bindListeners();
        this.addListeners();

        this.state = {
          left: false
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
