export declare class AlGltfModelEvents {
    static LOADED: string;
    static ERROR: string;
}
declare const _default: import("aframe").ComponentConstructor<{
    schema: {
        src: {
            type: string;
            default: string;
        };
        dracoDecoderPath: {
            type: string;
            default: string;
        };
    };
    init(): void;
    bindMethods(): void;
    addEventListeners(): void;
    removeEventListeners(): void;
    update(oldData: any): void;
    remove(): void;
}>;
export default _default;
