import { Constants } from '../../Constants';
import { ThreeUtils } from '../../utils';
import { BaseComponent } from './BaseComponent';
interface AlFixedToOrbitCameraState {
  distanceFromTarget: number;
  target: THREE.Vector3;
}

interface AlFixedToOrbitCameraComponent extends BaseComponent {
  tickFunction(): void;
}

export default AFRAME.registerComponent('al-fixed-to-orbit-camera', {
  schema: {
    distanceFromTarget: { type: 'number', default: 0.1 },
    target: { type: 'vec3' }
  },

  init() {
    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      Constants.minFrameMS / 2,
      this
    );

    if (this.data.target) {
      const targ = ThreeUtils.objectToVector3(this.data.target);

      this.state = {
        distanceFromTarget: this.data.distanceFromTarget,
        target: targ
      } as AlFixedToOrbitCameraState;
    } else {
      this.state = {
        distanceFromTarget: this.data.distanceFromTarget,
        target: new THREE.Vector3(0, 0, 0)
      } as AlFixedToOrbitCameraState;
    }

    this.bindMethods();
    this.addEventListeners();
  },

  // tslint:disable-next-line: no-empty
  bindMethods(): void {},

  // tslint:disable-next-line: no-empty
  addEventListeners(): void {},

  // tslint:disable-next-line: no-empty
  removeEventListeners(): void {},

  update() {
    const targ = ThreeUtils.objectToVector3(this.data.target);

    this.state = {
      distanceFromTarget: this.data.distanceFromTarget,
      target: targ
    } as AlFixedToOrbitCameraState;
  },

  tickFunction() {
    const el = this.el;
    const state = this.state;

    const camPos = el.sceneEl.camera.position;
    const dir = (state.target
      .clone()
      .sub(camPos.clone()) as THREE.Vector3).normalize();

    el.object3D.position.copy(dir.multiplyScalar(state.distanceFromTarget));
    el.object3D.lookAt(camPos);
  },

  tick() {
    this.tickFunction();
  },

  remove(): void {
    this.removeEventListeners();
  }
} as AlFixedToOrbitCameraComponent);
