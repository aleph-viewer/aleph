import { AframeComponent, AframeObject } from "../interfaces/interfaces";

export class AlToolSpawner implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      dependencies: ["raycaster"],

      schema: {},

      init(): void {
        this.el.addEventListener("raycaster-intersected", () => {
          this.el.emit("valid-target", { payload: true }, true);
        });

<<<<<<< HEAD
        this.el.addEventListener("raycaster-intersection", function() {
          console.log("Mouse hit focus!");
        });

        this.el.addEventListener("raycaster-intersected-cleared", function() {
          console.log("Mouse moved away!");
=======
        this.el.addEventListener("raycaster-intersected-cleared", () => {
          this.el.emit("valid-target", { payload: false }, true);
        });

        this.el.addEventListener("click", evt => {
          this.el.emit("add-tool", evt, true);
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
    return "al-tool-spawner";
  }
}
