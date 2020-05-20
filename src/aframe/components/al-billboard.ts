import { ThreeUtils } from "../../utils";

AFRAME.registerComponent("al-billboard", {
  schema: {
    cameraPosition: { type: "string" },
    cameraTarget: { type: "string", default: "0 0 0" },
    controlsType: { type: "string", default: "orbit" },
    minFrameMS: { type: "number", default: 15 },
    worldPosition: { type: "string" }
  },

  init() {
    this.bindMethods();
    this.addEventListeners();
    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      this.data.minFrameMS,
      this
    );
  },

  // tslint:disable-next-line: no-empty
  bindMethods() {},

  // tslint:disable-next-line: no-empty
  addEventListeners() {},

  // tslint:disable-next-line: no-empty
  removeEventListeners() {},

  // tslint:disable-next-line: no-empty
  tickFunction() {
    const camera = this.el.sceneEl.camera;
    const object = this.el.object3D;
    const worldPosition = ThreeUtils.stringToVector3(this.data.worldPosition);
    const cameraPosition = ThreeUtils.stringToVector3(this.data.cameraPosition);

    ThreeUtils.lookToFrustrumSpace(
      object,
      camera,
      worldPosition,
      cameraPosition
    );
    object.up.copy(this.el.sceneEl.camera.up);
  },

  tick() {
    this.tickFunction();
  },

  remove() {
    this.removeEventListeners();
  }
});
