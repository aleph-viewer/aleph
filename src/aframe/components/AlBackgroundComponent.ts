import { Constants } from '../../Constants';
import { BaseComponent } from './BaseComponent';

interface AlBackgroundComponent extends BaseComponent {
  tickFunction(): void;
}

export default AFRAME.registerComponent('al-background', {
  schema: {
    text: { type: 'string', default: '' }
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
    if (this.data.text !== oldData.text) {
      const parentGeom = (this.el.object3DMap.text as THREE.Mesh).geometry;
      parentGeom.computeBoundingBox();

      const size = new THREE.Vector3();
      parentGeom.boundingBox.getSize(size);

      console.log(size);
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
} as AlBackgroundComponent);
