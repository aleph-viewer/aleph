AFRAME.registerComponent("al-node-spawner", {
  schema: {
    graphEnabled: { type: "boolean" },
    minFrameMS: { type: "number", default: 15 }
  },

  init() {
    this.bindMethods();
    this.addEventListeners();

    this.state = {
      left: false,
      intersecting: false
    };
  },

  bindMethods() {
    this.canvasMouseDown = this.canvasMouseDown.bind(this);
    this.pointerOver = this.pointerOver.bind(this);
    this.pointerOut = this.pointerOut.bind(this);
    this.elClick = this.elClick.bind(this);
    this.canvasMouseUp = this.canvasMouseUp.bind(this);
    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);
  },

  addEventListeners() {
    this.el.sceneEl.canvas.addEventListener("mousedown", this.canvasMouseDown, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.sceneEl.canvas.addEventListener("mouseup", this.canvasMouseUp, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.addEventListener("raycaster-intersected", this.pointerOver, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.addEventListener(
      "raycaster-intersected-cleared",
      this.pointerOut,
      false
    );
    this.el.addEventListener("click", this.elClick, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.addEventListener("mousedown", this.pointerDown, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.addEventListener("mouseup", this.pointerUp, {
      capture: false,
      once: false,
      passive: true
    });
  },

  removeEventListeners() {
    this.el.sceneEl.canvas.removeEventListener(
      "mousedown",
      this.canvasMouseDown
    );
    this.el.sceneEl.canvas.removeEventListener("mouseup", this.canvasMouseUp);
    this.el.removeEventListener("raycaster-intersected", this.pointerOver);
    this.el.removeEventListener(
      "raycaster-intersected-cleared",
      this.pointerOut
    );
    this.el.removeEventListener("click", this.elClick);
    this.el.removeEventListener("mousedown", this.pointerDown);
    this.el.removeEventListener("mouseup", this.pointerUp);
  },

  canvasMouseDown(event) {
    this.state.left = event.button === 0;
  },

  canvasMouseUp(_event) {
    setTimeout(() => {
      this.state.left = false;
    }, this.data.minFrameMS);
  },

  pointerOver(_event) {
    this.state.intersecting = true;
    this.el.sceneEl.emit("al-valid-target", { valid: true }, false);
  },

  pointerOut(_event) {
    this.state.intersecting = false;
    this.el.sceneEl.emit("al-valid-target", { valid: false }, false);
  },

  pointerDown(_event) {
    if (this.data.graphEnabled) {
      this.el.sceneEl.emit("al-graph-pointer-down", {}, false);
    }
  },

  pointerUp(_event) {
    if (this.data.graphEnabled) {
      this.el.sceneEl.emit("al-graph-pointer-up", {}, false);
    }
  },

  elClick(event) {
    if (this.state.left && this.data.graphEnabled) {
      this.el.sceneEl.emit("al-add-node", { aframeEvent: event }, false);
    }
  },

  remove() {
    this.removeEventListeners();
  }
});
