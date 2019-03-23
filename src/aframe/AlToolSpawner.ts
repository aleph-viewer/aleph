import { AframeComponent, AframeObject } from "../interfaces/interfaces";

export class AlToolSpawner implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      dependencies: ["raycaster"],

      schema: {
        toolsEnabled: { type: "boolean" }
      },

      init(): void {
        this.el.addEventListener("mousedown", () => {
          if (this.data.toolsEnabled) {
            this.el.sceneEl.camera.el.setAttribute(
              "orbit-controls",
              "enabled: false"
            );
          }
        });

        this.el.addEventListener("mouseup", () => {
          if (this.data.toolsEnabled) {
            this.el.sceneEl.camera.el.setAttribute(
              "orbit-controls",
              "enabled: true"
            );
          }
        });

        this.el.addEventListener("raycaster-intersected", () => {
          this.el.emit("al-valid-target", { payload: true }, true);
        });

        this.el.addEventListener("raycaster-intersected-cleared", () => {
          this.el.emit("al-valid-target", { payload: false }, true);
        });

        this.el.addEventListener("click", evt => {
          this.el.emit("al-add-tool", evt, true);
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
    return "al-tool-spawner";
  }
}
