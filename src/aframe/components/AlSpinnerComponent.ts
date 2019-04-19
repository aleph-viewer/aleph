import { AframeRegistryEntry } from "../../interfaces";
import { ComponentDefinition } from "aframe";

export class AlSpinnerComponent implements AframeRegistryEntry {
  public static get Object(): ComponentDefinition {
    return {
      schema: {
        detail: { default: 0, min: 0, max: 5, type: "int" },
        radius: { default: 1, min: 0 }
      },

      init(data): void {
        this.geometry = new THREE.TetrahedronGeometry(data.radius, data.detail);
        this.geometry.applyMatrix(
          new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, -1).normalize(),
            Math.atan(Math.sqrt(2))
          )
        );
      }
    } as ComponentDefinition;
  }

  public static get Tag(): string {
    return "al-spinner";
  }
}
