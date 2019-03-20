import { AframeComponent, AframeObject } from "../interfaces/interfaces";

export class AlToolSpawner implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      dependencies: ['raycaster'],

      schema: {

      },

      init(): void {
        console.log("init tool spawner", this);

        this.el.addEventListener('raycaster-intersection', function () {
          console.log('Mouse hit focus!');
        });
        
        this.el.addEventListener('raycaster-intersected-cleared', function () {
          console.log('Mouse moved away!');
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
