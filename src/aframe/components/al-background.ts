import { Constants } from "../../Constants";

AFRAME.registerComponent("al-background", {
  schema: {
    boundingRadius: { type: "number", default: 1 },
    frustrumDistance: { type: "number", default: 1 },
    minFrameMS: { type: "number", default: 15 },
    scale: { type: "number", default: 8 },
    text: { type: "string", default: "" }
  },

  init() {
    this.state = {
      hasUpdated: false
    };

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

  // tslint:disable-next-line: no-any
  update(oldData: any) {
    if (this.data.text !== oldData.text) {
      this.state.hasUpdated = false;
    }
  },

  // tslint:disable-next-line: no-empty
  tickFunction() {
    if (!this.state.hasUpdated) {
      // const parentGeom = (this.el.parentEl.object3DMap.text as THREE.Mesh)
      //   .geometry as THREE.BufferGeometry;

      const parent = this.el.object3DMap.text;
      let parentGeom;
      if (parent) {
        parentGeom = parent.geometry;

        if (parentGeom.attributes.position) {
          parentGeom.computeBoundingBox();

          const size = new THREE.Vector3();
          parentGeom.boundingBox.getSize(size);

          const height =
            (size.y * 0.001 + Constants.textPadding.height) *
            this.data.boundingRadius;

          const planeGeom = new THREE.PlaneGeometry(1, 1, 1, 1);
          const planeMat = new THREE.MeshStandardMaterial();
          planeMat.color = new THREE.Color(Constants.colors.black);
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

  remove() {
    this.removeEventListeners();
  }
});
