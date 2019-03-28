import { AframeRegistry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";

interface AlEdgeState {
  geometry: THREE.Geometry;
  material: THREE.MeshBasicMaterial;
  line: THREE.Line;
  startNode: string;
  endNode: string;
}

export class AlNode implements AframeRegistry {
  public static getObject(): AframeComponent {
    return {
      schema: {
        startNode: { type: "string" },
        endNode: { type: "string" }
      },

      init(): void {
        this.onEnterVR = this.onEnterVR.bind(this);
        this.onExitVR = this.onExitVR.bind(this);

        const start: THREE.Vector3 = document
          .querySelector("#" + this.data.startNode)
          .getAttribute("position");
        const end: THREE.Vector3 = document
          .querySelector("#" + this.data.endNode)
          .getAttribute("position");

        const geometry = new THREE.Geometry();
        geometry.vertices.push(start, end);

        let material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(Constants.edgeColors.normal)
        });
        material.color = new THREE.Color(Constants.nodeColors.selected);
        const line = new THREE.Line(geometry, material);

        this.el.setObject3D("mesh", line);

        this.state = {
          geometry,
          material,
          line,
          startNode: this.data.startNode,
          endNode: this.data.endNode
        } as AlEdgeState;
      },

      update(): void {
        let state = this.state as AlEdgeState;
      },

      tick(): void {
        let state = this.state as AlEdgeState;
      },

      remove(): void {
        this.el.removeObject3D("mesh");
      }
    } as AframeComponent;
  }

  public static getName(): string {
    return "al-edge";
  }
}

export class AlEdgeEvents {}
