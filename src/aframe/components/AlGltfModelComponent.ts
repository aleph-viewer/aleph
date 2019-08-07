import { BaseComponent } from "./BaseComponent";

interface AlGltfModelComponent extends BaseComponent {}

export default AFRAME.registerComponent("al-gltf-model", {
  schema: {
    src: { type: "model", default: "" },
    dracoDecoderPath: { type: "string", default: "" }
  },

  init(): void {
    this.bindMethods();
    this.addEventListeners();
    this.model = null;
    this.loader = new (THREE as any).GLTFLoader();
    (THREE as any).DRACOLoader.setDecoderPath(this.data.dracoDecoderPath);
    this.loader.setDRACOLoader(new (THREE as any).DRACOLoader());
  },

  bindMethods(): void {},

  addEventListeners(): void {},

  removeEventListeners(): void {},

  update(oldData): void {
    let self = this;
    let el = this.el;
    let src = this.data.src;

    if (oldData && oldData.src !== src) {
      this.remove();

      this.loader.load(
        src,
        function gltfLoaded(gltfModel) {
          self.model = gltfModel.scene || gltfModel.scenes[0];
          self.model.animations = gltfModel.animations;
          // The "mesh" is actually a whole GLTF scene
          el.setObject3D("mesh", self.model);

          el.sceneEl.emit(
            AlGltfModelEvents.LOADED,
            {
              format: "gltf",
              model: self.model
            },
            false
          );
        },
        undefined /* onProgress */,
        function gltfFailed(error) {
          let message =
            error && error.message
              ? error.message
              : "Failed to load glTF model";
          console.warn(message);
          el.sceneEl.emit(
            AlGltfModelEvents.ERROR,
            {
              format: "gltf",
              src: src
            },
            false
          );
        }
      );
    }
  },

  remove(): void {
    if (!this.model) {
      return;
    }
    this.removeEventListeners();
    this.el.removeObject3D("mesh");
  }
} as AlGltfModelComponent);

export class AlGltfModelEvents {
  static LOADED: string = "al-model-loaded";
  static ERROR: string = "al-model-error";
}
