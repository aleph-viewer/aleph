import { AframeRegistryEntry } from "../../interfaces";
import { ComponentDefinition } from "aframe";

export class AlRenderOverlaidComponent implements AframeRegistryEntry {
  public static get Object(): ComponentDefinition {
    return {
      schema: {},

      init(_data?: any) {
        let mesh = this.el.object3DMap.mesh as THREE.Mesh;
        mesh.renderOrder = 999;
        //(mesh.material as THREE.Material).depthTest = false;
      }
    } as ComponentDefinition;
  }
  public static get Tag(): string {
    return "al-render-overlaid";
  }
}
