import { AframeComponent, AframeObject } from "../interfaces/interfaces";
import { GLTFUtils } from "../utils/utils";

export class AlGltfModel implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      schema: {
        src: { type: "model", default: "" },
        dracoDecoderPath: { type: "string", default: "" }
      },

      init(): void {
        this.model = null;
        this.loader = new THREE.GLTFLoader();
        (THREE as any).DRACOLoader.setDecoderPath(this.data.dracoDecoderPath);
        this.loader.setDRACOLoader(new (THREE as any).DRACOLoader());
      },

      update(): void {
        var self = this;
        var el = this.el;
        var src = this.data.src;

        if (!src) {
          return;
        }

        this.remove();

        this.loader.load(
          src,
          function gltfLoaded(gltfModel) {
            let res = GLTFUtils.setup(gltfModel);
            self.model = res.mesh;
            el.setObject3D("mesh", self.model);
            el.emit("model-loaded", { format: "gltf", model: self.model });
          },
          undefined /* onProgress */,
          function gltfFailed(error) {
            var message =
              error && error.message
                ? error.message
                : "Failed to load glTF model";
            console.warn(message);
            el.emit("model-error", { format: "gltf", src: src });
          }
        );
      },

      tick(): void {},

      remove(): void {
        if (!this.model) {
          return;
        }
        this.el.removeObject3D("mesh");
      },

      pause(): void {},

      play(): void {}
    } as AframeObject;
  }

  public static getName(): string {
    return "al-gltf-model";
  }
}
