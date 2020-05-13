AFRAME.registerComponent("al-render-overlaid", {
  schema: {
    renderOrder: { type: "number", default: 999 }
  },

  // tslint:disable-next-line: no-any
  init(_data?: any) {
    this.bindMethods();
    this.addEventListeners();
    this.setDepth(this.el.object3DMap.mesh);
    this.setDepth(this.el.object3DMap.text);
  },

  // tslint:disable-next-line: no-empty
  bindMethods() {},

  // tslint:disable-next-line: no-empty
  addEventListeners() {},

  // tslint:disable-next-line: no-empty
  removeEventListeners() {},

  setDepth(mesh: THREE.Mesh) {
    if (mesh) {
      mesh.renderOrder = this.data.renderOrder;
      if (mesh.material) {
        (mesh.material as THREE.Material).depthTest = false;
      }
    }
  },

  remove() {
    this.removeEventListeners();
  }
});
