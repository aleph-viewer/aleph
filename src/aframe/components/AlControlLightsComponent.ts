import { Constants } from "../../Constants";
import { BaseComponent } from "./BaseComponent";

export default AFRAME.registerComponent("al-control-lights", {
  schema: {},

  init() {
    this.bindMethods();
    this.addEventListeners();
    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      Constants.minFrameMS,
      this
    );

    const parent: THREE.Object3D = this.el.getObject3D("camera");

    const light1 = new THREE.DirectionalLight(
      new THREE.Color(Constants.colors.white),
      Constants.lightIntensity
    );
    light1.position.copy(new THREE.Vector3(1, 1, 1));
    parent.add(light1);

    const light2 = new THREE.DirectionalLight(
      new THREE.Color(Constants.colors.white),
      Constants.lightIntensity
    );
    light2.position.copy(new THREE.Vector3(-1, -1, -1));
    parent.add(light2);
  },

  // tslint:disable-next-line: no-empty
  bindMethods(): void {},

  // tslint:disable-next-line: no-empty
  addEventListeners(): void {},

  // tslint:disable-next-line: no-empty
  removeEventListeners(): void {},

  // tslint:disable-next-line: no-any
  update(oldData: any): void {
    // Reset the up vector if we change camera mode
    if (this.data.controlsType !== oldData.controlsType) {
      (this.el.object3D as THREE.Object3D).up.copy(
        this.el.sceneEl.camera.up.clone()
      );
    }
  },

  // tslint:disable-next-line: no-empty
  tick() {},

  // tslint:disable-next-line: no-empty
  remove(): void {}
} as BaseComponent);
