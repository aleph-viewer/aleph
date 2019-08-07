import { Constants } from "../../Constants";

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

  // tslint:disable-next-line: no-empty
  bindMethods(): void {},

  // tslint:disable-next-line: no-empty
  addEventListeners(): void {},

  // tslint:disable-next-line: no-empty
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
});
