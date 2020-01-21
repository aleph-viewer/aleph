import { BaseComponent } from "./BaseComponent";
interface AlEdgeComponent extends BaseComponent {
    tickFunction(): void;
    pointerDown(_event: CustomEvent): void;
    pointerOver(_event: CustomEvent): void;
    pointerOut(_event: CustomEvent): void;
}
declare const _default: import("aframe").ComponentConstructor<AlEdgeComponent>;
export default _default;
