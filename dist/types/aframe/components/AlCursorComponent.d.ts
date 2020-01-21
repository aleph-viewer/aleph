declare const _default: import("aframe").ComponentConstructor<{
    dependencies: string[];
    schema: {
        downEvents: {
            default: any[];
        };
        fuse: {
            default: boolean;
        };
        fuseTimeout: {
            default: number;
            min: number;
        };
        mouseCursorStylesEnabled: {
            default: boolean;
        };
        upEvents: {
            default: any[];
        };
        rayOrigin: {
            default: string;
            oneOf: string[];
        };
    };
    init: () => void;
    update: (oldData: any) => void;
    play: () => void;
    pause: () => void;
    remove: () => void;
    addEventListeners: () => void;
    removeEventListeners: () => void;
    updateMouseEventListeners: () => void;
    onMouseMove: (evt: any) => void;
    /**
     * Trigger mousedown and keep track of the mousedowned entity.
     */
    onCursorDown: (evt: any) => void;
    /**
     * Trigger mouseup if:
     * - Not fusing (mobile has no mouse).
     * - Currently intersecting an entity.
     * - Currently-intersected entity is the same as the one when mousedown was triggered,
     *   in case user mousedowned one entity, dragged to another, and mouseupped.
     */
    onCursorUp: (evt: any) => void;
    /**
     * Handle intersection.
     */
    onIntersection: (evt: any) => void;
    /**
     * Handle intersection cleared.
     */
    onIntersectionCleared: (evt: any) => void;
    setIntersection: (intersectedEl: any) => void;
    clearCurrentIntersection: (ignoreRemaining: any) => void;
    /**
     * Helper to emit on both the cursor and the intersected entity (if exists).
     */
    twoWayEmit: (evtName: any) => void;
}>;
/**
 * Cursor component. Applies the raycaster component specifically for starting the raycaster
 * from the camera and pointing from camera's facing direction, and then only returning the
 * closest intersection. Cursor can be fine-tuned by setting raycaster properties.
 *
 * @member {object} fuseTimeout - Timeout to trigger fuse-click.
 * @member {Element} cursorDownEl - Entity that was last mousedowned during current click.
 * @member {object} intersection - Attributes of the current intersection event, including
 *         3D- and 2D-space coordinates. See: http://threejs.org/docs/api/core/Raycaster.html
 * @member {Element} intersectedEl - Currently-intersected entity. Used to keep track to
 *         emit events when unintersecting.
 */
export default _default;
