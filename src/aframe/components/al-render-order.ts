AFRAME.registerComponent("al-render-order", {
  schema: {
    renderOrder: { type: "number", default: 999 }
  },

  init() {
    this.bindMethods();
    this.addEventListeners();

    Object.keys(this.el.object3DMap).forEach(key => {
      (this.el.object3DMap[
        key
      ]).renderOrder = this.data.renderOrder;
    });
  },

  // tslint:disable-next-line: no-empty
  bindMethods() {},

  // tslint:disable-next-line: no-empty
  addEventListeners() {},

  // tslint:disable-next-line: no-empty
  removeEventListeners() {},

  update() {
    Object.keys(this.el.object3DMap).forEach(key => {
      (this.el.object3DMap[
        key
      ]).renderOrder = this.data.renderOrder;
    });
  },

  remove() {
    this.removeEventListeners();
  }
});
