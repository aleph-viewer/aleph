import { BaseComponent } from "./BaseComponent";
export declare class AlVolumeEvents {
    static DEFAULT_RENDER_STEPS: string;
    static ERROR: string;
    static LOADED: string;
    static SLICES_MAX_INDEX: string;
    static VOLUME_RAY_REQUEST: string;
    static VOLUME_RAY_CAST: string;
}
export declare class AlVolumeCastType {
    static CREATE: string;
    static DRAG: string;
}
interface AlVolumeComponent extends BaseComponent {
    handleStack(stack: any): void;
    onInteraction(event: CustomEvent): void;
    onInteractionFinished(event: CustomEvent): void;
    renderBufferScene(): void;
    tickFunction(): void;
    createBufferTexture(): void;
    castVolumeRay(event: CustomEvent): void;
}
declare const _default: import("aframe").ComponentConstructor<AlVolumeComponent>;
export default _default;
