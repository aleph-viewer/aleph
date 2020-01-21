import { r as registerInstance, h, d as getElement, H as Host } from './core-684c60cc.js';
import { n as navLink } from './nav-link-utils-7601dc1b.js';
var NavPush = /** @class */ (function () {
    function class_1(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        this.push = function () {
            return navLink(_this.el, 'forward', _this.component, _this.componentProps);
        };
    }
    class_1.prototype.componentDidLoad = function () {
        console.warn('[DEPRECATED][ion-nav-push] `<ion-nav-push component="MyComponent">` is deprecated. Use `<ion-nav-link component="MyComponent">` instead.');
    };
    class_1.prototype.render = function () {
        return (h(Host, { onClick: this.push }));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { NavPush as ion_nav_push };
