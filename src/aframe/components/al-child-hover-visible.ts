AFRAME.registerComponent("al-child-hover-visible", {
  schema: {
    minFrameMS: { type: "number", default: 15 }
  },

  init() {
    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      this.data.minFrameMS,
      this
    );
    this.bindMethods();
    this.addEventListeners();

    this.hovered = false;
  },

  bindMethods() {
    this.pointerOver = this.pointerOver.bind(this);
    this.pointerOut = this.pointerOut.bind(this);
  },

  addEventListeners() {
    this.el.addEventListener("raycaster-intersected", this.pointerOver, {
      capture: true,
      once: false,
      passive: true
    });
    this.el.addEventListener("raycaster-intersected-cleared", this.pointerOut, {
      capture: false,
      once: false,
      passive: true
    });
  },

  removeEventListeners() {
    this.el.removeEventListener("raycaster-intersected", this.pointerOver);
    this.el.removeEventListener(
      "raycaster-intersected-cleared",
      this.pointerOut
    );
  },

  pointerOver(_event) {
    this.hovered = true;
  },

  pointerOut(_event) {
    this.hovered = false;
  },

  tickFunction() {
    const el = this.el;
    const firstChild: Entity = el.firstChild.firstChild;

    if (firstChild) {
      const obj3d: THREE.Object3D = firstChild.object3D;

      // show/hide label
      if (this.hovered) {
        obj3d.visible = true;
      } else {
        obj3d.visible = false;
      }
    }
  },

  tick() {
    this.tickFunction();
  },

  remove() {
    this.removeEventListeners();
  }
});
