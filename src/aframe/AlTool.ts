import { AframeComponent, AframeObject } from "../interfaces/interfaces";
import { RaycasterUtils, ThreeUtils } from "../utils/utils";
import { Constants } from "../Constants";

export class AlTool implements AframeComponent {
  public static getObject(): AframeObject {
    return {
<<<<<<< HEAD
      dependencies: ["raycaster"],

=======
>>>>>>> 50506096d19ed51f0d9b845176531d7a56973d58
      schema: {
        focusId: { type: "string", default: "#focusEntity" },
        maxRayDistance: { type: "number", default: 1 },
        scale: { type: "number", default: 1 },
        baseColor: { type: "string" }
      },

      init(): void {
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
        this.hoveredColor = new THREE.Color(Constants.colorValues.red);
        this.baseColor = new THREE.Color(this.data.baseColor);

        let geometry = new THREE.SphereGeometry(this.data.scale, 16, 16);
        let material = new THREE.MeshBasicMaterial({ color: this.baseColor });
        let mesh = new THREE.Mesh(geometry, material);
        this.el.setObject3D("mesh", mesh);
        //#endregion

        //#region Raycaster Setup
        let pos = this.el.getAttribute("position");

        let direction = pos
          .clone()
          .sub(this.focusObject.position)
          .normalize();
        this.raycaster = new THREE.Raycaster(
          pos,
          direction,
          0,
          this.camera.far
        );
        //#endregion

<<<<<<< HEAD
        this.el.addEventListener("raycaster-intersection", function() {
          console.log("Mouse hit something!");
        });

        this.el.addEventListener("raycaster-intersected-cleared", function() {
          console.log("Mouse moved away!");
=======
        //#region Event Listeners
        this.el.addEventListener("click", () => {
          let id = this.el.getAttribute("id");
          this.el.emit("tool-selected", { id: id }, true);
        });

        this.el.addEventListener("raycaster-intersected", () => {
          let mesh = this.el.object3DMap.mesh;
          (mesh.material as THREE.MeshBasicMaterial).color = this.hoveredColor;
        });

        this.el.addEventListener("raycaster-intersected-cleared", () => {
          let mesh = this.el.object3DMap.mesh;
          (mesh.material as THREE.MeshBasicMaterial).color = this.baseColor;
        });

        this.el.addEventListener("mouseup", () => {
          let raycaster = this.raycaster as THREE.Raycaster;
          raycaster.far = this.maxRayDistance;

          let result = RaycasterUtils.castMeshRay(
            this.raycaster,
            this.focusObject
          );

          // If we hit something with the world raycast
          if (result) {
            this.el.setAttribute(
              "position",
              ThreeUtils.vector3ToString(result)
            );

            // Update the raycaster for next frame
            let pos = this.el.getAttribute("position");
            let direction = pos
              .clone()
              .sub(this.focusObject.position)
              .normalize();
            (this.raycaster as THREE.Raycaster).set(pos, direction);
          }
>>>>>>> 50506096d19ed51f0d9b845176531d7a56973d58
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
