import { AframeRegistry, AframeComponent } from "../interfaces";

export class AlRenderOverlaid implements AframeRegistry {
  public static getObject(): AframeComponent {
    return {
      schema: {},

      init(_data?: any) {
        (this.object3DMap.mesh as THREE.Mesh).renderOrder = 999;
      },
    } as AlRenderOverlaid;
  }
  public static getName(): string {
    return "al-render-overlaid";
  }
}
