declare const _default: import("aframe").ComponentConstructor<{
    schema: {
        order: {
            type: string;
            default: number;
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
