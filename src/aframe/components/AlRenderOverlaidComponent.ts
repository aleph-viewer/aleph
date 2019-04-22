import { AframeRegistryEntry } from "../../interfaces";
import { ComponentDefinition } from "aframe";

export class AlRenderOverlaidComponent implements AframeRegistryEntry {
  public static get Object(): ComponentDefinition {
    return {
      schema: {},

      init(_data?: any) {
        this.setDepth(this.el.object3DMap.mesh);
        this.setDepth(this.el.object3DMap.text);
        //this.setDepth(this.el.object3DMap.line);
      },

      setDepth(mesh: THREE.Mesh) {
        if (mesh) {
          mesh.renderOrder = 999;
          if (mesh.material) {
            (mesh.material as THREE.Material).depthTest = false;
          }
        }
      }
    } as ComponentDefinition;
  }
  public static get Tag(): string {
    return "al-render-overlaid";
  }
}
