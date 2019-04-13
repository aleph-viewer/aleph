import { AframeRegistryEntry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";
import { DisplayMode } from "../enums";

interface AlBoundingBoxState {
  boundingBoxHelper: THREE.BoxHelper | null;
}

export class AlBoundingBox implements AframeRegistryEntry {
  public static get Object(): AframeComponent {
    return {
      schema: {
        srcLoaded: { type: "boolean" },
        visible: { type: "boolean" }
      },

      init(_data): void {
        this.state = {
          boundingBoxHelper: null
        } as AlBoundingBoxState;
      },

      update(oldData): void {
        const state = this.state as AlBoundingBoxState;
        const el = this.el;

        // on src load, set up boundingbox helper
        if (oldData && !oldData.srcLoaded && this.data.srcLoaded) {
          let mesh: THREE.Object3D;

          const volume = el.components["al-volume"];

          if (volume) {
            const displayMode: DisplayMode = volume.data.displayMode;
            const stackhelper = el.components["al-volume"].state.stackhelper;

            switch (displayMode) {
              case DisplayMode.VOLUME: {
                mesh = stackhelper._mesh;
                break;
              }
              case DisplayMode.SLICES: {
                mesh = stackhelper._bBox;
                break;
              }
            }
          } else {
            mesh = el.object3DMap.mesh;
          }

          const boundingBoxHelper = new THREE.BoxHelper(
            mesh,
            new THREE.Color(Constants.colorValues.red)
          );

          this.el.setObject3D("mesh", boundingBoxHelper);

          state.boundingBoxHelper = boundingBoxHelper;
        }

        if (state.boundingBoxHelper) {
          state.boundingBoxHelper.visible = this.data.visible;
        }
      },

      remove(): void {
        this.el.removeObject3D("mesh");
      }
    } as AframeComponent;
  }

  public static get Tag(): string {
    return "al-bounding-box";
  }
}
