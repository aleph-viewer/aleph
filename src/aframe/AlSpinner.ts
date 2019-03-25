import { AframeRegistry, AframeComponent } from "../interfaces/interfaces";

export class AlSpinner implements AframeRegistry {
  public static getObject(): AframeComponent {
    return {
      schema: {
        detail: { default: 0, min: 0, max: 5, type: "int" },
        radius: { default: 1, min: 0 }
      },

      init(data): void {
        this.onEnterVR = this.onEnterVR.bind(this);
        this.onExitVR = this.onExitVR.bind(this);

        this.geometry = new THREE.TetrahedronGeometry(data.radius, data.detail);
        this.geometry.applyMatrix(
          new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, -1).normalize(),
            Math.atan(Math.sqrt(2))
          )
        );
      },

      update(): void {},

      tick(): void {},

      remove(): void {},

      pause(): void {},

      play(): void {},

      onEnterVR(): void {},

      onExitVR(): void {}
    } as AframeComponent;
  }

  public static getName(): string {
    return "al-spinner";
  }
}
