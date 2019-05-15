import { AframeRegistryEntry } from "../../interfaces";
import { ComponentDefinition } from "aframe";

interface AlGltfModelDefinition extends ComponentDefinition {}

export class AlGltfModelComponent implements AframeRegistryEntry {
  public static get Object(): AlGltfModelDefinition {
    return {
      schema: {
        src: { type: "model", default: "" },
        dracoDecoderPath: { type: "string", default: "" }
      },

      init(): void {
        this.model = null;
        this.loader = new (THREE as any).GLTFLoader();
        (THREE as any).DRACOLoader.setDecoderPath(this.data.dracoDecoderPath);
        this.loader.setDRACOLoader(new (THREE as any).DRACOLoader());
      },

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
        this.el.removeObject3D("mesh");
      }
    } as AlGltfModelDefinition;
  }

  public static get Tag(): string {
    return "al-gltf-model";
  }
}

export class AlGltfModelEvents {
  static LOADED: string = "al-model-loaded";
  static ERROR: string = "al-model-error";
}
