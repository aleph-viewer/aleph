'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');
const overlays = require('./overlays-5a64fdf9.js');

const AlertController = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
    }
    /**
     * Create an alert overlay with alert options.
     *
     * @param options The options to use to create the alert.
     */
    create(options) {
        return overlays.createOverlay('ion-alert', options);
    }
    /**
     * Dismiss the open alert overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the alert.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the alert.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the alert to dismiss. If an id is not provided, it will dismiss the most recently opened alert.
     */
    dismiss(data, role, id) {
        return overlays.dismissOverlay(document, data, role, 'ion-alert', id);
    }
    /**
     * Get the most recently opened alert overlay.
     */
    async getTop() {
        return overlays.getOverlay(document, 'ion-alert');
    }
};

exports.ion_alert_controller = AlertController;
