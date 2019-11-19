import { ComponentDefinition } from "aframe";
interface AlOrbitControlComponent extends ComponentDefinition {
    dependencies: string[];
    tickFunction(): void;
    mouseUp(event: MouseEvent): void;
    mouseDown(event: MouseEvent): void;
    mouseMove(event: MouseEvent): void;
    canvasWheel(event: WheelEvent): void;
    onWheel(): void;
    handleAnimationCache(event: CustomEvent): void;
}
declare const _default: import("aframe").ComponentConstructor<AlOrbitControlComponent>;
export default _default;
