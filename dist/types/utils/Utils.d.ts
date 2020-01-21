import { Mesh } from "three";
import { AlCamera, AlNode } from "../interfaces";
export declare class Utils {
    static cssUnits: string[];
    static addCssUnits(d: string): string;
    static getFileExtension(file: string): string;
    static getFileEndCharacters(file: string, n: number): string;
    static getGeometryCenter(geometry: THREE.Geometry | THREE.BufferGeometry): THREE.Vector3;
    static getCameraStateFromMesh(mesh: Mesh): AlCamera;
    static getCameraPositionFromNode(node: AlNode, radius: number, cameraTarget: THREE.Vector3): THREE.Vector3;
    static getBoundingBox(obj: THREE.Object3D): THREE.Box3;
    static normalise(num: number, min: number, max: number): number;
    static reverseNumber(num: number, min: number, max: number): number;
}
