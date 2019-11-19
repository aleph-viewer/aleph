import { BaseComponent } from "./BaseComponent";
export declare class AlNodeSpawnerEvents {
    static VALID_TARGET: string;
    static ADD_NODE: string;
}
interface AlNodeSpawnerComponent extends BaseComponent {
    canvasMouseDown(event: MouseEvent): void;
    canvasMouseUp(event: MouseEvent): void;
    pointerOver(event: CustomEvent): void;
    pointerOut(event: CustomEvent): void;
    elClick(event: CustomEvent): void;
    pointerDown(event: CustomEvent): void;
    pointerUp(event: CustomEvent): void;
}
declare const _default: import("aframe").ComponentConstructor<AlNodeSpawnerComponent>;
export default _default;
