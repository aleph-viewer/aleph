import { AframeRegistry, AframeComponent } from "../interfaces";
import { AlNodeEvents } from ".";

interface AlEdgeSpawnerState {
  nodeSpawnerShift: boolean;
  nodeShifted: string;
}

interface AlEdgeSpawnerObject extends AframeComponent {
  bindListeners(): void;
  addListeners(): void;
  removeListeners(): void;
  canvasMouseUp(): void;
  remove(): void;
  nodeShifted(): void;
}

export class AlEdgeSpawner implements AframeRegistry {
  public static getObject(): AlEdgeSpawnerObject {
    return {
      schema: {},

      bindListeners() {
        this.canvasMouseUp = this.canvasMouseUp.bind(this);
        this.nodeShifted = this.nodeShifted.bind(this);
      },

      addListeners() {
        this.el.sceneEl.canvas.addEventListener("mouseup", this.canvasMouseUp);
        this.el.addEventListener(
          AlNodeEvents.NODE_SHIFT_CLICKED,
          this.nodeShifted
        );
      },

      removeListeners() {
        this.el.sceneEl.canvas.removeEventListener(
          "mouseup",
          this.canvasMouseUp
        );
        this.el.removeEventListener(
          AlNodeEvents.NODE_SHIFT_CLICKED,
          this.nodeShifted
        );
      },

      canvasMouseUp(_event: MouseEvent) {
        this.state.nodeSpawnerShift = false;
        this.state.nodeShifted = false;
      },

      nodeShifted(event: CustomEvent) {
        this.state.nodeShifted = event.detail.id;
        console.log("edge-spawner node-shifted: ", this.state.nodeShifted);
      },

      init(): void {
        this.bindListeners();
        this.addListeners();

        this.state = {
          nodeSpawnerShift: false,
          nodeShifted: ""
        } as AlEdgeSpawnerState;
      },

      remove(): void {
        this.removeListeners();
      }
    } as AlEdgeSpawnerObject;
  }

  public static getName(): string {
    return "al-edge-spawner";
  }
}

export class AlEdgeSpawnerEvents {
  static ADD_EDGE: string = "al-add-edge";
}
