import { Constants } from "../../Constants";
import { ThreeUtils } from "../../utils";

interface AlBoundingBoxState {
  box: THREE.Box3;
  // tslint:disable-next-line: no-any
  boundingBox: any;
  geometry: THREE.BoxGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
}

export default AFRAME.registerComponent("al-bounding-box", {
  schema: {
    color: { type: "string", default: "#f50057" },
    scale: { type: "string" }
  },

  init(): void {
    this.bindMethods();
    this.addEventListeners();

    this.state = {
      box: new THREE.Box3()
    } as AlBoundingBoxState;
  },

  bindMethods(): void {},

  addEventListeners(): void {},

  removeEventListeners(): void {},

  update(): void {
    const el = this.el;
    const state = this.state as AlBoundingBoxState;
    const scale = ThreeUtils.stringToVector3(this.data.scale);

    state.box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), scale);

    // Add a second mesh for raycasting in volume mode
    const geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
    const material = new THREE.MeshBasicMaterial({
      color: this.data.color,
      visible: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    el.setObject3D("mesh2", mesh);

    state.boundingBox = new (THREE as any).Box3Helper(
      state.box as any,
      this.data.color
    );
    state.boundingBox.renderOrder = Constants.topLayerRenderOrder - 5;
    el.setObject3D("mesh", state.boundingBox);

    state.geometry = geometry;
    state.material = material;
    state.mesh = mesh;
  },

  remove(): void {
    this.removeEventListeners();
    this.el.removeObject3D("mesh");
    this.el.removeObject3D("mesh2");
  }
});
