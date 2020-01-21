declare const _default: import("aframe").ComponentConstructor<{
    schema: {
        color: {
            type: string;
            default: string;
        };
        scale: {
            type: string;
        };
        enabled: {
            type: string;
            default: boolean;
        };
    };
    init(): void;
    bindMethods(): void;
    addEventListeners(): void;
    removeEventListeners(): void;
    update(): void;
    remove(): void;
}>;
export default _default;
