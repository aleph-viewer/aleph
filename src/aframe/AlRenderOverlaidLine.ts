import { AframeRegistry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";

export class AlRenderOverlaidLine implements AframeRegistry {
  public static get Object(): AframeComponent {
    return {
      schema: {},

      init(_data?: any) {
        let mesh = this.el.object3DMap.line as THREE.Mesh;
        (mesh.material as THREE.Material).depthTest = false;
        (mesh.material as THREE.LineBasicMaterial).color = new THREE.Color(
          Constants.colorValues.blue
        );
      }
    } as AframeComponent;
  }
  public static get Tag(): string {
    return "al-render-overlaid-line";
  }
}
