import { AframeRegistry, AframeComponent } from "../interfaces/interfaces";
import { GLTFUtils } from "../utils/utils";

export class AlGltfModel implements AframeRegistry {
  public static getObject(): AframeComponent {
    return {
      schema: {
        src: { type: "model", default: "" },
        dracoDecoderPath: { type: "string", default: "" }
      },

      init(): void {
        this.onEnterVR = this.onEnterVR.bind(this);
        this.onExitVR = this.onExitVR.bind(this);

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
            el.emit(AlGltfModelEvents.LOADED, {
              format: "gltf",
              model: self.model
            });
            el.emit(
              AlGltfModelEvents.MESH_DISTANCE,
              { dist: res.maxDist },
              true
            );
          },
          undefined /* onProgress */,
          function gltfFailed(error) {
            var message =
              error && error.message
                ? error.message
                : "Failed to load glTF model";
            console.warn(message);
            el.emit(AlGltfModelEvents.ERROR, { format: "gltf", src: src });
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

      play(): void {},

      onEnterVR(): void {},

      onExitVR(): void {}
    } as AframeComponent;
  }

  public static getName(): string {
    return "al-gltf-model";
  }
}

export class AlGltfModelEvents {
  static LOADED: string = "al-model-loaded";
  static MESH_DISTANCE: string = "al-mesh-distance";
  static ERROR: string = "al-model-error";
}
