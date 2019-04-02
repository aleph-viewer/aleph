import { AframeRegistry, AframeComponent } from "../interfaces";

export class AlRenderTextOverlaid implements AframeRegistry {
  public static get Object(): AframeComponent {
    return {
      schema: {},

      init(_data?: any) {
        let mesh = this.el.object3DMap.text;
        mesh.renderOrder = 999;
        (mesh.material as THREE.Material).depthTest = false;
      }
    } as AframeComponent;
  }
  public static get Tag(): string {
    return "al-render-text-overlaid";
  }
}
