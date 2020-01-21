import { ComponentDefinition } from "aframe";
interface AlTrackballControlComponent extends ComponentDefinition {
    dependencies: string[];
    tickFunction(): void;
    mouseUp(event: MouseEvent): void;
    mouseDown(event: MouseEvent): void;
    mouseMove(event: MouseEvent): void;
    canvasWheel(event: WheelEvent): void;
    onWheel(): void;
    handleAnimationCache(event: CustomEvent): void;
}
declare const _default: import("aframe").ComponentConstructor<AlTrackballControlComponent>;
export default _default;
