import {
  AframeRegistryEntry,
  AframeComponent,
  AframeShader
} from "../../interfaces";

export class AlSpinnerComponent implements AframeRegistryEntry {
  public static get Object(): AframeComponent | AframeShader {
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
    } as AframeComponent;
  }

  public static get Tag(): string {
    return "al-spinner";
  }
}
