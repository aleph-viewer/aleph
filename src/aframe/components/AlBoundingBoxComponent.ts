import { AframeRegistryEntry, AframeComponent } from "../../interfaces";
import { ThreeUtils } from "../../utils";

export class AlBoundingBoxComponent implements AframeRegistryEntry {
  public static get Object(): AframeComponent {
    return {
      schema: {
        color: { type: "string", default: "#f50057" },
        scale: { type: "string" }
      },

      init(_data): void {
        this.box = new THREE.Box3();
      },

      update(): void {
        const el = this.el;
        this.box.setFromCenterAndSize(
          new THREE.Vector3(0, 0, 0),
          ThreeUtils.stringToVector3(this.data.scale)
        );
        this.boundingBox = new (THREE as any).Box3Helper(
          this.box as any,
          this.data.color
        );
        el.setObject3D("mesh", this.boundingBox);
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
