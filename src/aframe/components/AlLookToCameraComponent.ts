import { Constants } from '../../Constants';
import { BaseComponent } from './BaseComponent';

interface AlLookToCameraComponent extends BaseComponent {
  tickFunction(): void;
}

export default AFRAME.registerComponent('al-look-to-camera', {
  schema: {
    isTrackball: { type: 'boolean', default: false }
  },

  init() {
    this.bindMethods();
    this.addEventListeners();
    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      Constants.minFrameMS,
      this
    );
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
    if (this.data.isTrackball !== oldData.isTrackball) {
      (this.el.object3D as THREE.Object3D).up.copy(
        this.el.sceneEl.camera.up.clone()
      );
    }
  },

  tickFunction() {
    this.el.object3D.lookAt(this.el.sceneEl.camera.position);

    // Copy to up vector to make sure it stays upright
    // TODO: Add check for VR mode to prevent this behaviour
    if (this.data.isTrackball) {
      (this.el.object3D as THREE.Object3D).up.copy(
        this.el.sceneEl.camera.up.clone()
      );
    }
  },

  tick() {
    this.tickFunction();
  },

  remove(): void {
    this.removeEventListeners();
  }
} as AlLookToCameraComponent);
