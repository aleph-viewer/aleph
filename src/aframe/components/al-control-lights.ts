AFRAME.registerComponent("al-control-lights", {
  schema: {
    color: { type: "string", default: "#fff" },
    controlsType: { type: "string", default: "orbit" },
    lightIntensity: { type: "number", default: 0.8 },
    minFrameMS: { type: "number", default: 15 }
  },

  init() {

    this.bindMethods();
    this.addEventListeners();
    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      this.data.minFrameMS,
      this
    );

    const parent = this.el.getObject3D("camera");

    const light1 = new THREE.DirectionalLight(
      new THREE.Color(this.data.color),
      this.data.lightIntensity
    );

    light1.position.copy(new THREE.Vector3(1, 1, 1));
    parent.add(light1);

    const light2 = new THREE.DirectionalLight(
      new THREE.Color(this.data.color),
      this.data.lightIntensity
    );

    light2.position.copy(new THREE.Vector3(-1, -1, -1));
    parent.add(light2);
  },

  bindMethods() {},

  addEventListeners() {},

  removeEventListeners() {},

  update(oldData) {
    // Reset the up vector if we change camera mode
    if (this.data.controlsType !== oldData.controlsType) {
      this.el.object3D.up.copy(
        this.el.sceneEl.camera.up.clone()
      );
    }
  },

  tick() {},

  remove() {}
});
