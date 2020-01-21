'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');
const overlays = require('./overlays-5a64fdf9.js');

const ToastController = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
    }
    /**
     * Create a toast overlay with toast options.
     *
     * @param options The options to use to create the toast.
     */
    create(options) {
        return overlays.createOverlay('ion-toast', options);
    }
    /**
     * Dismiss the open toast overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the toast. For example, 'cancel' or 'backdrop'.
     * @param id The id of the toast to dismiss. If an id is not provided, it will dismiss the most recently opened toast.
     */
    dismiss(data, role, id) {
        return overlays.dismissOverlay(document, data, role, 'ion-toast', id);
    }
    /**
     * Get the most recently opened toast overlay.
     */
    async getTop() {
        return overlays.getOverlay(document, 'ion-toast');
    }
};

exports.ion_toast_controller = ToastController;
