import { AlCamera } from "../interfaces";
import { Constants } from "../Constants";
import { AlOrbitControlEvents } from "../aframe";

type Entity = import("aframe").Entity;
type Scene = import("aframe").Scene;

export class ThreeUtils {
  // Must use setAttribute, otherwise THREE.OrbitControls onMouseUp doesn't always pick up the change :-(
  static enableOrbitControls(camEntity: Entity, enabled: boolean) {
    camEntity.setAttribute("al-orbit-control", `enabled: ${enabled}`);
  }

  static waitOneFrame(func: () => void) {
    window.setTimeout(() => {
      func();
    }, Constants.minFrameMS);
  }

  static objectToVector3(vec: {
    x: number;
    y: number;
    z: number;
  }): THREE.Vector3 {
    let res = new THREE.Vector3();
    res.x = vec.x;
    res.y = vec.y;
    res.z = vec.z;
    return res;
  }

  static worldToScreen(
    worldCoordinate: THREE.Vector3,
    camera: THREE.Camera,
    container
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

  static vector3ToString(vec: THREE.Vector3): string {
    return vec.toArray().join(" ");
  }

  static stringToVector3(vec: string): THREE.Vector3 {
    let res = vec.split(" ");
    let vect = new THREE.Vector3();
    vect.x = Number(res[0]);
    vect.y = Number(res[1]);
    vect.z = Number(res[2]);

    return vect;
  }

  // https://en.wikipedia.org/wiki/Slerp
  static slerp(
    start: THREE.Vector3,
    end: THREE.Vector3,
    percent: number
  ): THREE.Vector3 | null {
    const t = percent;
    const p0 = start;
    const p1 = end;
    let theta = p0.angleTo(p1);
    // todo: if NaN the resulting null target causes the animations to fail (I think)
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

  static easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  static getSlerpPath(
    start: AlCamera,
    end: AlCamera,
    positionChange: boolean,
    targetChange: boolean
  ): number[] {
    let path = [];

    // add epsilon to avoid NaN due to divide by 0 in the atan in angleTo
    const sp: THREE.Vector3 = start.position.clone().addScalar(Number.EPSILON);
    const st: THREE.Vector3 = start.target.clone().addScalar(Number.EPSILON);
    const ep: THREE.Vector3 = end.position.clone().addScalar(Number.EPSILON);
    const et: THREE.Vector3 = end.target.clone().addScalar(Number.EPSILON);

    for (let frame = 1; frame <= Constants.maxAnimationSteps; frame++) {
      let percent = this.easeInOutCubic(frame / Constants.maxAnimationSteps);
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
}
