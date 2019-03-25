import { AframeRegistry, AframeComponent } from "../interfaces/interfaces";

export class AlToolSpawner implements AframeRegistry {
  public static getObject(): AframeComponent {
    return {
      dependencies: ["raycaster"],

      schema: {
        toolsEnabled: { type: "boolean" }
      },

      init(): void {
        this.onEnterVR = this.onEnterVR.bind(this);
        this.onExitVR = this.onExitVR.bind(this);

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

      play(): void {},

      onEnterVR(): void {},

      onExitVR(): void {}
    } as AframeComponent;
  }

  public static getName(): string {
    return "al-tool-spawner";
  }
}
