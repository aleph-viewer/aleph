import { BaseComponent } from "./BaseComponent";
interface AlNodeComponent extends BaseComponent {
    tickFunction(): void;
    pointerDown(_event: CustomEvent): void;
    pointerUp(_event: MouseEvent): void;
    pointerOver(_event: CustomEvent): void;
    pointerOut(_event: CustomEvent): void;
}
declare const _default: import("aframe").ComponentConstructor<AlNodeComponent>;
export default _default;
export declare class AlNodeEvents {
    static ANIMATION_STARTED: string;
}
