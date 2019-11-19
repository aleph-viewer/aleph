import { ControlsType } from "../enums";
import { AlCamera } from "../interfaces";
declare type Entity = import("aframe").Entity;
export declare class ThreeUtils {
    static isWebGL2Available(): boolean;
    static enableControls(camEntity: Entity, enabled: boolean, type: ControlsType): void;
    static waitOneFrame(func: () => void): void;
    static objectToVector3(vec: {
        x: number;
        y: number;
        z: number;
    }): THREE.Vector3;
    static worldToScreen(worldCoordinate: THREE.Vector3, camera: THREE.Camera, container: any): THREE.Vector3;
    static vector3ToString(vec: THREE.Vector3): string;
    static stringToVector3(vec: string): THREE.Vector3;
    static slerp(start: THREE.Vector3, end: THREE.Vector3, percent: number): THREE.Vector3 | null;
    static easeInOutCubic(t: number): number;
    static getSlerpCameraPath(start: AlCamera, end: AlCamera, positionChange: boolean, targetChange: boolean): number[];
    static getSlerp3Path(start: THREE.Vector3, end: THREE.Vector3): number[];
    static lookToFrustrumSpace(object: THREE.Object3D, camera: THREE.PerspectiveCamera, worldPosition: THREE.Vector3, cameraPosition: THREE.Vector3): void;
    static getFrustrumSpaceDistance(camera: THREE.Camera, worldPosition: THREE.Vector3, cameraPosition: THREE.Vector3): number;
}
export {};
