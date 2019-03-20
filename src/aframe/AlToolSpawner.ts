import { AframeComponent, AframeObject } from "../interfaces/interfaces";

export class AlToolSpawner implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      dependencies: ["raycaster"],

      schema: {},

      init(): void {
        console.log("init tool spawner", this);

        this.el.addEventListener("raycaster-intersected", () => {
          //console.log("Mouse hit focus!");
          this.el.emit("valid-target", { payload: true }, true);
        });

        this.el.addEventListener("raycaster-intersected-cleared", () => {
          //console.log("Mouse moved away!");
          this.el.emit("valid-target", { payload: false }, true);
        });

        this.el.addEventListener("click", evt => {
          //console.log(evt.detail.intersection.point);
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
