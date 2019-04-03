import { AframeRegistry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";
import { update } from "@tweenjs/tween.js";

interface AlRenderOrderObject {
  update(): void;
}

export class AlRenderOrder implements AframeRegistry {
  public static get Object(): AlRenderOrderObject {
    return {
      schema: {
        order: { type: "number", default: Constants.topLayerRenderOrder }
      },

      init(_data?: any) {
        Object.keys(this.el.object3DMap).forEach(key => {
          (this.el.object3DMap[
            key
          ] as THREE.Object3D).renderOrder = this.data.order;
        });
      },

      update() {
        Object.keys(this.el.object3DMap).forEach(key => {
          (this.el.object3DMap[
            key
          ] as THREE.Object3D).renderOrder = this.data.order;
        });
      }
    } as AlRenderOrderObject;
  }
  public static get Tag(): string {
    return "al-render-order";
  }
}
