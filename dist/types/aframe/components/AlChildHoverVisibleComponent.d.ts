import { BaseComponent } from "./BaseComponent";
interface AlChildHoverVisibleComponent extends BaseComponent {
    tickFunction(): void;
    pointerOver(_event: CustomEvent): void;
    pointerOut(_event: CustomEvent): void;
}
declare const _default: import("aframe").ComponentConstructor<AlChildHoverVisibleComponent>;
export default _default;
