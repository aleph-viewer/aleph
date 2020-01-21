'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');

const RouteRedirect = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
        this.ionRouteRedirectChanged = core.createEvent(this, "ionRouteRedirectChanged", 7);
    }
    propDidChange() {
        this.ionRouteRedirectChanged.emit();
    }
    connectedCallback() {
        this.ionRouteRedirectChanged.emit();
    }
    static get watchers() { return {
        "from": ["propDidChange"],
        "to": ["propDidChange"]
    }; }
};

exports.ion_route_redirect = RouteRedirect;
