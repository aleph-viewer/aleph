import { Constants } from "../Constants";
import { AlCamera } from "../interfaces";

type Entity = import("aframe").Entity;

export class ThreeUtils {
  public static isWebGL2Available() {
    try {
      // tslint:disable-next-line: no-any
      const canvas: any = document.createElement("canvas");
      return !!// tslint:disable-next-line: no-any
      ((window as any).WebGL2RenderingContext && canvas.getContext("webgl2"));
    } catch (e) {
      return false;
    }
  }

  // Must use setAttribute, otherwise THREE.OrbitControls onMouseUp doesn't always pick up the change :-(
  public static enableControls(
    camEntity: Entity,
    enabled: boolean,
    isTrackball: boolean
  ) {
    isTrackball
      ? camEntity.setAttribute("al-trackball-control", `enabled: ${enabled}`)
      : camEntity.setAttribute("al-orbit-control", `enabled: ${enabled}`);
  }

  public static waitOneFrame(func: () => void) {
    window.setTimeout(() => {
      func();
    }, Constants.minFrameMS);
  }

  public static objectToVector3(vec: {
    x: number;
    y: number;
    z: number;
  }): THREE.Vector3 {
    const res = new THREE.Vector3();
    res.x = vec.x;
    res.y = vec.y;
    res.z = vec.z;
    return res;
  }

  public static worldToScreen(
    worldCoordinate: THREE.Vector3,
    camera: THREE.Camera,
    // tslint:disable-next-line: no-any
    container: any
  ): THREE.Vector3 {
    const screenCoordinates = worldCoordinate.clone();
    screenCoordinates.project(camera);

    screenCoordinates.x = Math.round(
      ((screenCoordinates.x + 1) * container.offsetWidth) / 2
    );
    screenCoordinates.y = Math.round(
      ((-screenCoordinates.y + 1) * container.offsetHeight) / 2
    );
    screenCoordinates.z = 0;

    return screenCoordinates;
  }

  public static vector3ToString(vec: THREE.Vector3): string {
    return vec.toArray().join(" ");
  }

  public static stringToVector3(vec: string): THREE.Vector3 {
    const res = vec.split(" ");
    const vect = new THREE.Vector3();
    vect.x = Number(res[0]);
    vect.y = Number(res[1]);
    vect.z = Number(res[2]);

    return vect;
  }

  // https://en.wikipedia.org/wiki/Slerp
  public static slerp(
    start: THREE.Vector3,
    end: THREE.Vector3,
    percent: number
  ): THREE.Vector3 | null {
    const t = percent;
    const p0 = start;
    const p1 = end;
    let theta = p0.angleTo(p1);
    if (theta) {
      theta = THREE.Math.clamp(theta, -0.99, 0.99);

      const topP0 = Math.sin(1 - t) * theta;
      const topP1 = Math.sin(t * theta);
      const bot = Math.sin(theta);

      const p0Const = topP0 / bot;
      const p1Const = topP1 / bot;

      const left = p0.clone().multiplyScalar(p0Const);
      const right = p1.clone().multiplyScalar(p1Const);
      const result = left.add(right);

      return result;
    } else {
      return null;
    }
  }

  public static easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  public static getSlerpCameraPath(
    start: AlCamera,
    end: AlCamera,
    positionChange: boolean,
    targetChange: boolean
  ): number[] {
    const path = [];

    // add epsilon to avoid NaN due to divide by 0 in the atan in angleTo
    const sp: THREE.Vector3 = start.position.clone().addScalar(Number.EPSILON);
    const st: THREE.Vector3 = start.target.clone().addScalar(Number.EPSILON);
    const ep: THREE.Vector3 = end.position.clone().addScalar(Number.EPSILON);
    const et: THREE.Vector3 = end.target.clone().addScalar(Number.EPSILON);

    for (let frame = 0; frame <= Constants.maxAnimationSteps; frame++) {
      const percent = this.easeInOutCubic(frame / Constants.maxAnimationSteps);
      path.push({
        position: positionChange
          ? ThreeUtils.slerp(sp.clone(), ep.clone(), percent)
          : ep,
        target: targetChange
          ? ThreeUtils.slerp(st.clone(), et.clone(), percent)
          : et
      } as AlCamera);
    }

    return path;
  }

  public static getSlerpPath(
    start: THREE.Vector3,
    end: THREE.Vector3
  ): number[] {
    const path = [];

    // add epsilon to avoid NaN due to divide by 0 in the atan in angleTo
    const sp: THREE.Vector3 = start.clone().addScalar(Number.EPSILON);
    const ep: THREE.Vector3 = end.clone().addScalar(Number.EPSILON);

    for (let frame = 0; frame <= Constants.maxAnimationSteps; frame++) {
      const percent = this.easeInOutCubic(frame / Constants.maxAnimationSteps);
      path.push(ThreeUtils.slerp(sp.clone(), ep.clone(), percent));
    }

    return path;
  }
}
