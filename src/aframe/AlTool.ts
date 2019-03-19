import { AframeComponent, AframeObject } from "../interfaces/interfaces";
import { RaycasterUtils } from "../utils/utils";
import { Constants } from "../Constants";

export class AlTool implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      schema: {
        focusId: { type: "string", default: "focusEntity" },
        needsUpdate: { type: "boolean", default: "false" },
        boundingScale: { type: "number", default: "1" },
        initialPosition: { type: "vec3", default: "0 0 0" },
        maxRayDistance: { type: "number", default: "1" }
      },

      init(): void {
        console.log("init tool", this);

        //#region State setup
        const cam = document.querySelector("a-camera").object3DMap.camera;
        if (!cam) {
          console.error("no camera in scene!: " + cam);
        }
        this.camera = cam;

        const focus = document.querySelector("#" + this.data.focusId)
          .object3DMap.mesh;
        if (!focus) {
          console.error("no focus in scene!: " + focus);
        }
        this.focusEntity = focus;
        //#endregion

        //#region Mesh Setup
        let geometry = new THREE.SphereGeometry(
          1 * this.data.boundingScale,
          16,
          16
        );
        let material = new THREE.MeshBasicMaterial({
          color: Constants.colorValues.blue
        });
        let mesh = new THREE.Mesh(geometry, material);
        this.el.setObject3D("mesh", mesh);
        //#endregion

        //#region Raycaster Setup
        const initialPosition = new THREE.Vector3(
          this.data.initialPosition.x,
          this.data.initialPosition.y,
          this.data.initialPosition.z
        );
        let direction = initialPosition
          .sub(this.focusEntity.position)
          .normalize();
        this.raycaster = new THREE.Raycaster(
          this.mesh.position,
          direction,
          0,
          this.camera.far
        );
        //#endregion

        this.needsUpdate = this.data.needsUpdate;
      },

      update(): void {
        let raycaster = this.raycaster as THREE.Raycaster;
        let mesh = this.el.object3DMap.mesh;
        raycaster.far = this.maxRayDistance;

        let result = RaycasterUtils.castMeshRay(
          this.raycaster,
          this.focusEntity
        );

        // If we hit something with the world raycast
        if (result) {
          mesh.position.copy(result);
        }

        // Update the raycaster for next frame
        let direction = mesh.position
          .sub(this.focusEntity.position)
          .normalize();
        (this.raycaster as THREE.Raycaster).set(this.mesh.position, direction);

        // Reset needsUpdate
        this.needsUpdate = false;
      },

      tick(): void {},

      remove(): void {},

      pause(): void {},

      play(): void {}
    } as AframeObject;
  }

  public static getName(): string {
    return "al-tool";
  }
}
