import { AframeComponent, AframeObject } from "../interfaces/interfaces";
import { RaycasterUtils, ThreeUtils } from "../utils/utils";
import { Constants } from "../Constants";

export class AlTool implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      schema: {
        focusId: { type: "string", default: "#focusEntity" },
        maxRayDistance: { type: "number", default: 1 }
      },

      init(): void {
        //console.log("init tool", this);

        //#region State setup
        try {
          this.camera = this.el.sceneEl.camera.el.object3DMap.camera;
        } catch {
          console.error("no camera in scene!: " + this.el.sceneEl);
        }

        // Not properly selecting from document!
        try {
          const docEl = this.el.sceneEl.querySelector(this.data.focusId);
          const focus = docEl.object3DMap.mesh;
          this.focusObject = focus;
        } catch {
          console.error("no focus in scene!: " + this);
        }
        //#endregion

        //#region Mesh Setup
        let geometry = new THREE.SphereGeometry(1, 16, 16);

        this.selectedColor = new THREE.Color(Constants.colorValues.red);
        this.normalColor = new THREE.Color(Constants.colorValues.blue);

        let material = new THREE.MeshBasicMaterial({
          color: this.normalColor
        });

        let mesh = new THREE.Mesh(geometry, material);
        this.el.setObject3D("mesh", mesh);
        //#endregion

        //#region Raycaster Setup
        let pos = this.el.getAttribute("position");
        //console.log(pos);

        let direction = pos.sub(this.focusObject.position).normalize();
        this.raycaster = new THREE.Raycaster(
          pos,
          direction,
          0,
          this.camera.far
        );
        //#endregion

        //#region Event Listeners
        this.el.addEventListener("raycaster-intersected", () => {
          //console.log("Mouse hit tool!");

          let mesh = this.el.object3DMap.mesh;
          (mesh.material as THREE.MeshBasicMaterial).color = this.selectedColor;
        });

        this.el.addEventListener("raycaster-intersected-cleared", () => {
          //console.log("Mouse out of tool!");

          let mesh = this.el.object3DMap.mesh;
          (mesh.material as THREE.MeshBasicMaterial).color = this.normalColor;
        });

        /**
         * On mouse release
         */
        this.el.addEventListener("mouseup", () => {
          let raycaster = this.raycaster as THREE.Raycaster;
          let mesh = this.el.object3DMap.mesh;
          raycaster.far = this.maxRayDistance;

          let result = RaycasterUtils.castMeshRay(
            this.raycaster,
            this.focusObject
          );

          // If we hit something with the world raycast
          if (result) {
            console.log(result);
            this.el.setAttribute(
              "position",
              ThreeUtils.vector3ToString(result)
            );

            // Update the raycaster for next frame
            let pos = this.el.getAttribute("position");
            let direction = mesh.position
              .sub(this.focusObject.position)
              .normalize();
            (this.raycaster as THREE.Raycaster).set(pos, direction);
          }
        });

        //#endregion
      },

      update(): void {},

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
