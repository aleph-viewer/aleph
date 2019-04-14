import { AframeRegistryEntry, AframeComponent } from "../interfaces";
import { DisplayMode } from "../enums";

export class AlBoundingBox implements AframeRegistryEntry {
  public static get Object(): AframeComponent {
    return {
      schema: {
        srcLoaded: { type: "boolean" },
        displayMode: { type: "string", default: DisplayMode.MESH },
        visible: { type: "boolean" },
        color: { type: "string", default: "#f50057" }
      },

      init(_data): void {},

      update(): void {
        const el = this.el;

        this.el.removeObject3D("bbox");

        if (this.data.srcLoaded) {
          let mesh: THREE.Object3D;

          const gltf = el.components["al-gltf-model"];
          const volume = el.components["al-volume"];

          switch (this.data.displayMode) {
            case DisplayMode.MESH: {
              if (gltf) {
                mesh = gltf.model;
              }
              break;
            }
            case DisplayMode.VOLUME: {
              if (volume) {
                mesh = volume.state.stackhelper._mesh;
              }
              break;
            }
            case DisplayMode.SLICES: {
              if (volume) {
                mesh = volume.state.stackhelper._bBox;
              }
              break;
            }
          }

          if (mesh) {
            this.boundingBoxHelper = new THREE.BoxHelper(
              mesh,
              new THREE.Color(this.data.color)
            );

            this.el.setObject3D("bbox", this.boundingBoxHelper);
          }
        }

        if (this.boundingBoxHelper) {
          this.boundingBoxHelper.visible = this.data.visible;
        }
      },

      remove(): void {
        this.el.removeObject3D("bbox");
      }
    } as AframeComponent;
  }

  public static get Tag(): string {
    return "al-bounding-box";
  }
}
