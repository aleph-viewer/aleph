export interface AframeObject {
    schema: {};
    init: () => void;
    update: () => void;
    tick: () => void;
    remove: () => void;
    pause: () => void;
    play: () => void;
}