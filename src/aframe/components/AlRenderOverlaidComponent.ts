import { Constants } from "../../Constants";
import { BaseComponent } from "./BaseComponent";

interface AlRenderOverlaidComponent extends BaseComponent {}

export default AFRAME.registerComponent("al-render-overlaid", {
  schema: {},

  init(_data?: any) {
    this.bindMethods();
    this.addEventListeners();
    this.setDepth(this.el.object3DMap.mesh);
    this.setDepth(this.el.object3DMap.text);
    //this.setDepth(this.el.object3DMap.line);
  },

  bindMethods(): void {},

  addEventListeners(): void {},

  removeEventListeners(): void {},

  setDepth(mesh: THREE.Mesh) {
    if (mesh) {
      mesh.renderOrder = Constants.topLayerRenderOrder;
      if (mesh.material) {
        (mesh.material as THREE.Material).depthTest = false;
      }
    }
  },

  remove(): void {
    this.removeEventListeners();
  }
} as AlRenderOverlaidComponent);
