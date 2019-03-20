import { AframeComponent, AframeObject } from "../interfaces/interfaces";
import { RaycasterUtils } from "../utils/utils";
import { Constants } from "../Constants";
import { Entity } from "aframe";
export class AlTool implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      schema: {
        focusId: { type: "string", default: "#focusEntity" },
        maxRayDistance: { type: "number", default: 1 }
      },

      init(): void {
        console.log("init tool", this);

        //#region State setup
        try {
          this.camera = this.el.sceneEl.camera.el.object3DMap.camera;
        } catch {
          console.error("no camera in scene!: " + this.el.sceneEl);
        }

        // Not properly selecting from document!
        try {
          const docEl = document.getElementById(this.data.focusId) as Entity;
          const focus = docEl.object3DMap.mesh;
          this.focusObject = focus;
        } catch {
          console.error("no focus in scene!: " + this);
        }
        //#endregion

        //#region Mesh Setup
        this.geometry = new THREE.SphereGeometry(1, 16, 16);

        this.selectedColor = new THREE.Color(Constants.colorValues.red);
        this.normalColor = new THREE.Color(Constants.colorValues.blue);

        this.material = new THREE.MeshBasicMaterial({
          color: this.normalColor
        });

        let mesh = new THREE.Mesh(this.geometry, this.material);
        this.el.setObject3D("mesh", mesh);
        //#endregion

        //#region Raycaster Setup
        let pos = this.el.getAttribute("position");
        console.group(pos);

        /*let direction = 
          .sub(this.focusObject.position)
          .normalize();
        this.raycaster = new THREE.Raycaster(
          this.mesh.position,
          direction,
          0,
          this.camera.far
        );*/
        //#endregion

        //#region Event Listeners
        this.el.addEventListener("raycaster-intersected", function() {
          console.log("Mouse hit tool!");
          (this.material as THREE.MeshBasicMaterial).color = this.selectedColor;
        });

        this.el.addEventListener("raycaster-intersected-cleared", function() {
          console.log("Mouse out of tool!");
          (this.material as THREE.MeshBasicMaterial).color = this.normalColor;
        });

        /**
         * On mouse release
         */
        this.el.addEventListener("mouseup", function() {
          let raycaster = this.raycaster as THREE.Raycaster;
          let mesh = this.el.object3DMap.mesh;
          raycaster.far = this.maxRayDistance;

          let result = RaycasterUtils.castMeshRay(
            this.raycaster,
            this.focusObject
          );

          // If we hit something with the world raycast
          if (result) {
            mesh.position.copy(result);
          }

          // Update the raycaster for next frame
          let direction = mesh.position
            .sub(this.focusObject.position)
            .normalize();
          (this.raycaster as THREE.Raycaster).set(
            this.mesh.position,
            direction
          );
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
