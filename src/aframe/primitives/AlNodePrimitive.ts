import { AframeRegistryEntry } from "../../interfaces";
import { PrimitiveDefinition } from "aframe";

export class AlNodePrimitive implements AframeRegistryEntry {
  public static get Object(): PrimitiveDefinition {
    return {
      defaultComponents: {
        alnode: {}
      },

      mappings: {
        alscale: "alnode.scale",
        alselected: "alnode.selected",
        algraphenabled: "alnode.graphenabled"
      }
    };
  }

  public static get Tag(): string {
    return "al-node";
  }
}
