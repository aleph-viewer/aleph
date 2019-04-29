import { AframeRegistryEntry } from "../../interfaces";
import { ThreeUtils } from "../../utils";
import { ComponentDefinition } from "aframe";

interface AlBoundingBoxState {
  box: THREE.Box3;
  boundingBox: any;
  geometry: THREE.BoxGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
}

export class AlBoundingBoxDefinition implements AframeRegistryEntry {
  public static get Object(): ComponentDefinition {
    return {
      schema: {
        color: { type: "string", default: "#f50057" },
        scale: { type: "string" }
      },

      init(_data): void {
        this.state = {
          box: new THREE.Box3()
        } as AlBoundingBoxState;
      },

      update(): void {
        const el = this.el;
        let state = this.state as AlBoundingBoxState;
        let scale = ThreeUtils.stringToVector3(this.data.scale);

        state.box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), scale);

        // Add a second mesh for raycasting in volume mode
        let geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
        let material = new THREE.MeshBasicMaterial({
          color: this.data.color,
          visible: false
        });
        let mesh = new THREE.Mesh(geometry, material);
        el.setObject3D("mesh2", mesh);

        state.boundingBox = new (THREE as any).Box3Helper(
          state.box as any,
          this.data.color
        );
        el.setObject3D("mesh", state.boundingBox);

        state.geometry = geometry;
        state.material = material;
        state.mesh = mesh;
      },

      remove(): void {
        this.el.removeObject3D("mesh");
        this.el.removeObject3D("mesh2");
      }
    } as ComponentDefinition;
  }

  public static get Tag(): string {
    return "al-bounding-box";
  }
}
