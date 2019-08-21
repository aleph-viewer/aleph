import { Constants } from "../../Constants";
import { BaseComponent } from "./BaseComponent";

interface AlBackgroundComponent extends BaseComponent {
  tickFunction(): void;
}

interface AlBackgroundState {
  hasUpdated: boolean;
}

export default AFRAME.registerComponent("al-background", {
  schema: {
    text: { type: "string", default: "" },
    boundingRadius: { type: "number", default: 1 },
    scale: { type: "number", default: 8 }
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
      const parentGeom = (this.el.parentEl.object3DMap.text as THREE.Mesh)
        .geometry as THREE.BufferGeometry;

      if (parentGeom.attributes.position) {
        parentGeom.computeBoundingBox();

        const size = new THREE.Vector3();
        parentGeom.boundingBox.getSize(size);

        const height =
          (size.y * this.data.boundingRadius) /
          (this.data.scale * Constants.nodeSizeRatio);
        const width =
          (size.x * this.data.boundingRadius) /
          (this.data.scale * Constants.nodeSizeRatio);

        const mesh = this.el.object3DMap.mesh as THREE.Mesh;

        mesh.scale.set(width * 1.1, height * 1.2, 1);

        const material = mesh.material as THREE.MeshStandardMaterial;

        // material.depthWrite = false;
        material.flatShading = true;
        material.roughness = 1;

        const position = this.el.getAttribute("position") as THREE.Vector3;
        position.sub(new THREE.Vector3(0, position.y * 0.05, 0.00001));
        this.el.setAttribute("position", position);

        this.state.hasUpdated = true;
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
