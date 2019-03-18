export default interface AframeComponent {
    schema: {},
    init: () => void;
    update: () => void;
    tick: () => void;
    remove: () => void;
    pause: () => void;
    play: () => void;
}