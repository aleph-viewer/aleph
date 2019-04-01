import { AframeRegistry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";
import { ThreeUtils } from "../utils";

interface AlEdgeState {
  geometry: THREE.Geometry;
  material: THREE.LineBasicMaterial;
  line: THREE.Line;
  node2: string;
  node1: string;
  node1Event: string;
  node2Event: string;
  titleId: string;
  color: string;
}

interface AlEdgeObject extends AframeComponent {
  bindListeners(): void;
  addListeners(): void;
  removeListeners(): void;
  remove(): void;
  node1Listener(event: CustomEvent): void;
  node2Listener(event: CustomEvent): void;
  updateDistance(): void;
}

export class AlEdge implements AframeRegistry {
  public static getObject(): AlEdgeObject {
    return {
      schema: {
        node1: { type: "string" },
        node2: { type: "string" }
      },

      updateDistance() {
        const start: THREE.Vector3 = document
          .querySelector("#" + this.data.node1)
          .getAttribute("position");
        const end: THREE.Vector3 = document
          .querySelector("#" + this.data.node2)
          .getAttribute("position");

        if (this.el.getAttribute("line")) {
          this.el.removeAttribute("line");
        }

        this.el.setAttribute(
          "line",
          `
          start: ${ThreeUtils.vector3ToString(start)};
          end: ${ThreeUtils.vector3ToString(end)}; 
          color: ${this.state.color};
        `
        );

        window.setTimeout(() => {
          const dist: number = start.distanceTo(end);

          let textEl = document.querySelector("#" + this.state.titleId);
          textEl.setAttribute(
            "text",
            `
          value: ${dist.toFixed(4) + " units"};
          side: double;
          baseline: bottom;
          anchor: center;
        `
          );

          const textDir = start
            .clone()
            .sub(end.clone())
            .normalize();
          const textPos = textDir.multiplyScalar(dist);

          this.el.setAttribute("position", ThreeUtils.vector3ToString(textPos));
          textEl.setAttribute("position", ThreeUtils.vector3ToString(textPos));
          console.log(textPos);
        }, Constants.minFrameMS);
      },

      bindListeners() {
        this.node1Listener = this.node1Listener.bind(this);
        this.node2Listener = this.node2Listener.bind(this);
        this.updateDistance = this.updateDistance.bind(this);
      },

      addListeners() {
        this.el.addEventListener(this.state.node1Event, this.node1Listener, {
          capture: false,
          once: false,
          passive: true
        });
        this.el.addEventListener(this.state.node2Event, this.node2Listener, {
          capture: false,
          once: false,
          passive: true
        });
      },

      removeListeners() {
        this.el.removeEventListener(
          this.state.node1Event,
          this.node1Listener,
          false
        );
        this.el.removeEventListener(
          this.state.node2Event,
          this.node2Listener,
          false
        );
      },

      node1Listener(_event: CustomEvent) {
        this.updateDistance();
      },

      node2Listener(_event: CustomEvent) {
        this.updateDistance();
      },

      init(): void {
        const node1Event = this.data.node1 + Constants.movedEventString;
        const node2Event = this.data.node2 + Constants.movedEventString;
        const titleId = this.el.id + Constants.titleIdString;

        this.state = {
          node1: this.data.node1,
          node2: this.data.node2,
          node1Event,
          node2Event,
          titleId,
          color: Constants.edgeColors.normal
        } as AlEdgeState;

        this.bindListeners();
        this.addListeners();
        this.updateDistance();
      },

      remove(): void {
        this.removeListeners();
      }
    } as AlEdgeObject;
  }

  public static getName(): string {
    return "al-edge";
  }
}

export class AlEdgeEvents {}
