import { Constants } from '../../Constants';
import { BaseComponent } from './BaseComponent';

interface AlBackgroundComponent extends BaseComponent {
  tickFunction(): void;
}

interface AlBackgroundState {
  hasUpdated: boolean;
}

export default AFRAME.registerComponent('al-background', {
  schema: {
    text: { type: 'string', default: '' },
    boundingRadius: { type: 'number', default: 1 },
    scale: { type: 'number', default: 8 },
    frustrumDistance: { type: 'number', default: 1 }
  },

  init() {
    this.state = {
      hasUpdated: false
    } as AlBackgroundState;

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
      this.state.hasUpdated = false;
    }
  },

  // tslint:disable-next-line: no-empty
  tickFunction() {
    if (!this.state.hasUpdated) {
      // const parentGeom = (this.el.parentEl.object3DMap.text as THREE.Mesh)
      //   .geometry as THREE.BufferGeometry;

      const parent = this.el.object3DMap.text as THREE.Mesh;
      let parentGeom;
      if (parent) {
        parentGeom = parent.geometry as THREE.BufferGeometry;

        if (parentGeom.attributes.position) {
          parentGeom.computeBoundingBox();

          const size = new THREE.Vector3();
          parentGeom.boundingBox.getSize(size);

          const height =
            (size.y * 0.001 + Constants.textPadding.height) *
            this.data.boundingRadius;

          const planeGeom = new THREE.PlaneGeometry(1, 1, 1, 1);
          const planeMat = new THREE.MeshStandardMaterial();
          planeMat.color = new THREE.Color(Constants.colorValues.black);
          planeMat.transparent = true;
          planeMat.opacity = 0.9;
          planeMat.flatShading = true;
          planeMat.roughness = 1;
          planeMat.depthTest = false;
          const mesh = new THREE.Mesh(planeGeom, planeMat);
          mesh.scale.set(
            (size.x * 0.001 + Constants.textPadding.width) *
              this.data.boundingRadius,
            height,
            1
          );
          mesh.renderOrder = Constants.topLayerRenderOrder - 1;
          mesh.position.add(
            new THREE.Vector3(0, height * (this.data.frustrumDistance / 4), 0)
          );
          this.el.object3D.add(mesh);
          this.state.hasUpdated = true;
        }
      }
    }
  },

  tick() {
    this.tickFunction();
  },

  remove(): void {
    this.removeEventListeners();
  }
} as AlBackgroundComponent);
