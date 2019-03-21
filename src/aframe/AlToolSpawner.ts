import { AframeComponent, AframeObject } from "../interfaces/interfaces";

export class AlToolSpawner implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      dependencies: ["raycaster"],

      schema: {},

      init(): void {
        this.el.addEventListener("mousedown", () => {
          console.log("mouseDown");
          this.el.sceneEl.camera.el.setAttribute(
            "orbit-controls",
            "enabled: false"
          );
        });

        this.el.addEventListener("mouseup", () => {
          console.log("mouseUp");
          this.el.sceneEl.camera.el.setAttribute(
            "orbit-controls",
            "enabled: true"
          );
        });

        this.el.addEventListener("raycaster-intersected", () => {
          this.el.emit("valid-target", { payload: true }, true);
        });

        this.el.addEventListener("raycaster-intersected-cleared", () => {
          this.el.emit("valid-target", { payload: false }, true);
        });

        this.el.addEventListener("click", evt => {
          this.el.emit("add-tool", evt, true);
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
