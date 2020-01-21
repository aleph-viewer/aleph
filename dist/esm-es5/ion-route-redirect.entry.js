import { r as registerInstance, c as createEvent } from './core-684c60cc.js';
var RouteRedirect = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
        this.ionRouteRedirectChanged = createEvent(this, "ionRouteRedirectChanged", 7);
    }
    class_1.prototype.propDidChange = function () {
        this.ionRouteRedirectChanged.emit();
    };
    class_1.prototype.connectedCallback = function () {
        this.ionRouteRedirectChanged.emit();
    };
    Object.defineProperty(class_1, "watchers", {
        get: function () {
            return {
                "from": ["propDidChange"],
                "to": ["propDidChange"]
            };
        },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { RouteRedirect as ion_route_redirect };
