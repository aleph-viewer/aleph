import { r as registerInstance, h, d as getElement, H as Host } from './core-684c60cc.js';
import { n as navLink } from './nav-link-utils-7601dc1b.js';
var NavPop = /** @class */ (function () {
    function class_1(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        this.pop = function () {
            return navLink(_this.el, 'back');
        };
    }
    class_1.prototype.componentDidLoad = function () {
        console.warn('[DEPRECATED][ion-nav-pop] <ion-nav-pop> is deprecated. Use `<ion-nav-link routerDirection="back">` instead.');
    };
    class_1.prototype.render = function () {
        return (h(Host, { onClick: this.pop }));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { NavPop as ion_nav_pop };
