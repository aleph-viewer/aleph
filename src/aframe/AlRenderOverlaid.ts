import { AframeRegistry, AframeComponent } from "../interfaces";

export class AlRenderOverlaid implements AframeRegistry {
  public static get Object(): AframeComponent {
    return {
      schema: {},

      init(_data?: any) {
        let mesh = this.el.object3DMap.mesh as THREE.Mesh;
        mesh.renderOrder = 999;
        //(mesh.material as THREE.Material).depthTest = false;
      }
    } as AframeComponent;
  }
  public static get Tag(): string {
    return "al-render-overlaid";
  }
}
