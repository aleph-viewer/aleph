import { AframeComponent, AframeObject } from "../interfaces/interfaces";

export class AlSurfaceLocker implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      schema: {},

      init(): void {},

      update(): void {},

      tick(): void {},

      remove(): void {},

      pause(): void {},

      play(): void {}
    } as AframeObject;
  }

  public static getName(): string {
    return "al-surface-locker";
  }
}
