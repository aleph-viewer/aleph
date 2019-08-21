import { Constants } from '../../Constants';
import { ThreeUtils } from '../../utils';
import { BaseComponent } from './BaseComponent';

interface AlScreenSpace extends BaseComponent {
  tickFunction(): void;
}

export default AFRAME.registerComponent('al-screen-space', {
  schema: {
    position: { type: 'string' },
    boundingRadius: { type: 'number', default: 1 },
    cameraPosition: { type: 'string' }
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

  // tslint:disable-next-line: no-any no-empty
  update(_oldData: any): void {},

  tickFunction() {
    const camera = this.el.sceneEl.camera as THREE.PerspectiveCamera;
    const object = this.el.object3D as THREE.Object3D;

    const worldPosition = ThreeUtils.stringToVector3(this.data.position);

    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const distance = ThreeUtils.stringToVector3(
      this.data.cameraPosition
    ).distanceTo(new THREE.Vector3(0, 0, 0));
    const lookPlane = new THREE.Plane(cameraDirection, distance);

    const frustrumDirection = new THREE.Vector3();
    lookPlane.projectPoint(worldPosition, frustrumDirection);

    const ray = new THREE.Ray(worldPosition);
    ray.lookAt(frustrumDirection);
    const pointD = ray.distanceToPlane(lookPlane);

    // Apply this as the new position
    object.lookAt(frustrumDirection);
    const scale = pointD * Constants.zoomFactor;
    this.el.setAttribute('scale', `${scale} ${scale} ${scale}`);
  },

  tick() {
    this.tickFunction();
  },

  remove(): void {
    this.removeEventListeners();
  }
} as AlScreenSpace);
