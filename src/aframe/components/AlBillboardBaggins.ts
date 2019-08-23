import { Constants } from '../../Constants';
import { ControlsType } from '../../enums';
import { ThreeUtils } from '../../utils';
import { BaseComponent } from './BaseComponent';

interface AlLookToCameraComponent extends BaseComponent {
  tickFunction(): void;
}

export default AFRAME.registerComponent('al-billboard-baggins', {
  schema: {
    controlsType: { type: 'string', default: ControlsType.ORBIT },
    cameraPosition: { type: 'string' },
    worldPosition: { type: 'string' }
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
    const camera = this.el.sceneEl.camera as THREE.PerspectiveCamera;
    const object = this.el.object3D as THREE.Object3D;
    const worldPosition = ThreeUtils.stringToVector3(this.data.worldPosition);
    const cameraPosition = ThreeUtils.stringToVector3(this.data.cameraPosition);

    // Reset the up vector if we change camera mode
    if (this.data.controlsType !== oldData.controlsType) {
      (this.el.object3D as THREE.Object3D).up.copy(
        this.el.sceneEl.camera.up.clone()
      );
    }

    switch (this.data.controlsType) {
      case ControlsType.TRACKBALL: {
        ThreeUtils.lookToFrustrumSpace(
          object,
          camera,
          worldPosition,
          cameraPosition
        );
        object.up.copy(this.el.sceneEl.camera.up.clone());
        break;
      }
      case ControlsType.ORBIT: {
        ThreeUtils.lookToFrustrumSpace(
          object,
          camera,
          worldPosition,
          cameraPosition
        );
        break;
      }
      default: {
        ThreeUtils.lookToFrustrumSpace(
          object,
          camera,
          worldPosition,
          cameraPosition
        );
        break;
      }
    }
  },

  // tslint:disable-next-line: no-empty
  tickFunction() {},

  tick() {
    this.tickFunction();
  },

  remove(): void {
    this.removeEventListeners();
  }
} as AlLookToCameraComponent);
