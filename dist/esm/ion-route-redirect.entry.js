import { r as registerInstance, c as createEvent } from './core-684c60cc.js';

const RouteRedirect = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.ionRouteRedirectChanged = createEvent(this, "ionRouteRedirectChanged", 7);
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

export { RouteRedirect as ion_route_redirect };
