import { AframeRegistry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";

interface AlEdgeState {
  geometry: THREE.Geometry;
  material: THREE.LineBasicMaterial;
  line: THREE.Line;
  node2: string;
  node1: string;
  node1String: string;
  node2String: string
}

interface AlEdgeObject extends AframeComponent {
  bindListeners(): void;
  addListeners(): void;
  removeListeners(): void;
  update(): void;
  tickFunction(): void;
  tick(): void;
  remove(): void;
  node1Listener(event: CustomEvent): void;
  node2Listener(event: CustomEvent): void;
}

export class AlNode implements AframeRegistry {
  public static getObject(): AlEdgeObject {
    return {
      schema: {
        node1: { type: "string" },
        node2: { type: "string" }
      },

      bindListeners() {
        this.node1Listener = this.node1Listener.bind(this);
        this.node2Listener = this.node2Listener.bind(this);
      },

      addListeners() {
        this.el.addEventListener(this.state.node1String, this.node1Listener, false);
        this.el.addEventListener(this.state.node2String, this.node2Listener, false);
      },

      removeListeners() {
        this.el.removeEventListener(this.state.node1String, this.node1Listener, false);
        this.el.removeEventListener(this.state.node2String, this.node2Listener, false);
      },

      node1Listener(event: CustomEvent) {
        let geom = this.state.geometry as THREE.Geometry;

        geom.vertices[0].copy(event.detail.newPosition);
        geom.verticesNeedUpdate = true;
      },

      node2Listener(event: CustomEvent) {
        let geom = this.state.geometry as THREE.Geometry;

        geom.vertices[1].copy(event.detail.newPosition);
        geom.verticesNeedUpdate = true;
      },

      init(): void {
        this.tickFunction = AFRAME.utils.throttle(
          this.tickFunction,
          Constants.minTimeForThrottle,
          this
        );
        this.bindListeners();
        this.addListeners();

        const start: THREE.Vector3 = document
          .querySelector("#" + this.data.startNodeId)
          .getAttribute("position");
        const end: THREE.Vector3 = document
          .querySelector("#" + this.data.endNodeId)
          .getAttribute("position");



        const geometry = new THREE.Geometry();
        geometry.vertices.push(start, end);
        geometry.verticesNeedUpdate = true;

        let material = new THREE.LineBasicMaterial({
          color: new THREE.Color(Constants.edgeColors.normal)
        });
        material.color = new THREE.Color(Constants.nodeColors.selected);
        const line = new THREE.Line(geometry, material);

        this.el.setObject3D("mesh", line);

        const node1String = this.data.node1 + Constants.movedString;
        const node2String = this.data.node2 + Constants.movedString;

        this.state = {
          geometry,
          material,
          line,
          node1: this.data.node1,
          node2: this.data.node2,
          node1String,
          node2String
        } as AlEdgeState;
      },

      update(): void {
        let state = this.state as AlEdgeState;
      },

      tickFunction() {
        let state = this.state as AlEdgeState;
      },

      tick(): void {
        this.tickFunction();
      },

      remove(): void {
        this.removeListeners();
        this.el.removeObject3D("mesh");
      }
    } as AlEdgeObject;
  }

  public static getName(): string {
    return "al-edge";
  }
}

export class AlEdgeEvents {}
