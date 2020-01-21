import { BaseComponent } from "./BaseComponent";
interface AlAngleComponent extends BaseComponent {
    tickFunction(): void;
    pointerDown(_event: CustomEvent): void;
    pointerOver(_event: CustomEvent): void;
    pointerOut(_event: CustomEvent): void;
}
declare const _default: import("aframe").ComponentConstructor<AlAngleComponent>;
export default _default;
