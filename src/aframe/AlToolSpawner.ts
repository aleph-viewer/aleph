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
              "al-orbit-control",
              "enabled: false"
            );
          }
        });

        this.el.addEventListener("mouseup", () => {
          if (this.data.toolsEnabled) {
            this.el.sceneEl.camera.el.setAttribute(
              "al-orbit-control",
              "enabled: true"
            );
          }
        });

        this.el.addEventListener("raycaster-intersected", () => {
          this.el.emit(
            AlToolSpawnerEvents.VALID_TARGET,
            { payload: true },
            true
          );
        });

        this.el.addEventListener("raycaster-intersected-cleared", () => {
          this.el.emit(
            AlToolSpawnerEvents.VALID_TARGET,
            { payload: false },
            true
          );
        });

        this.el.addEventListener("click", evt => {
          this.el.emit(AlToolSpawnerEvents.ADD_TOOL, evt, true);
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

export class AlToolSpawnerEvents {
  static VALID_TARGET: string = "al-valid-target";
  static ADD_TOOL: string = "al-add-tool";
}
