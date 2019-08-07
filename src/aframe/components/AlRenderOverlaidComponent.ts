import { Constants } from '../../Constants';

export default AFRAME.registerComponent('al-render-overlaid', {
  schema: {},

  // tslint:disable-next-line: no-any
  init(_data?: any) {
    this.bindMethods();
    this.addEventListeners();
    this.setDepth(this.el.object3DMap.mesh);
    this.setDepth(this.el.object3DMap.text);
  },

  // tslint:disable-next-line: no-empty
  bindMethods(): void {},

  // tslint:disable-next-line: no-empty
  addEventListeners(): void {},

  // tslint:disable-next-line: no-empty
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
});
