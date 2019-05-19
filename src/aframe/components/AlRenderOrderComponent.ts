import { Constants } from "../../Constants";
import { BaseComponent } from "./BaseComponent";

interface AlRenderOrderDefinition extends BaseComponent {}

export default AFRAME.registerComponent("al-render-order", {
  schema: {
    order: { type: "number", default: Constants.topLayerRenderOrder }
  },

  init() {
    this.bindMethods();
    this.addEventListeners();

    Object.keys(this.el.object3DMap).forEach(key => {
      (this.el.object3DMap[
        key
      ] as THREE.Object3D).renderOrder = this.data.order;
    });
  },

  bindMethods(): void {},

  addEventListeners(): void {},

  removeEventListeners(): void {},

  update() {
    Object.keys(this.el.object3DMap).forEach(key => {
      (this.el.object3DMap[
        key
      ] as THREE.Object3D).renderOrder = this.data.order;
    });
  },

  remove(): void {
    this.removeEventListeners();
  }
} as AlRenderOrderDefinition);
