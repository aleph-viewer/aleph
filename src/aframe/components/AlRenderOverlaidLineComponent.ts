import { AframeRegistryEntry } from "../../interfaces";
import { Constants } from "../../Constants";
import { ComponentDefinition } from "aframe";

export class AlRenderOverlaidLineComponent implements AframeRegistryEntry {
  public static get Object(): ComponentDefinition {
    return {
      schema: {},

      init(_data?: any) {
        let mesh = this.el.object3DMap.line as THREE.Mesh;
        (mesh.material as THREE.Material).depthTest = false;
        (mesh.material as THREE.LineBasicMaterial).color = new THREE.Color(
          Constants.colorValues.blue
        );
      }
    } as ComponentDefinition;
  }
  public static get Tag(): string {
    return "al-render-overlaid-line";
  }
}
