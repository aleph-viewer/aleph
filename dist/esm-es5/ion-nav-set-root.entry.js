import { r as registerInstance, h, d as getElement, H as Host } from './core-684c60cc.js';
import { n as navLink } from './nav-link-utils-7601dc1b.js';
var NavSetRoot = /** @class */ (function () {
    function class_1(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        this.setRoot = function () {
            return navLink(_this.el, 'root', _this.component, _this.componentProps);
        };
    }
    class_1.prototype.componentDidLoad = function () {
        console.warn('[DEPRECATED][ion-nav-set-root] `<ion-nav-set-root component="MyComponent">` is deprecated. Use `<ion-nav-link component="MyComponent" routerDirection="root">` instead.');
    };
    class_1.prototype.render = function () {
        return (h(Host, { onClick: this.setRoot }));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { NavSetRoot as ion_nav_set_root };
