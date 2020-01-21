import { r as registerInstance, f as getIonMode, h, H as Host } from './core-684c60cc.js';
import { o as openURL, c as createColorClasses } from './theme-955ba954.js';
var Anchor = /** @class */ (function () {
    function class_1(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        /**
         * When using a router, it specifies the transition direction when navigating to
         * another page using `href`.
         */
        this.routerDirection = 'forward';
        this.onClick = function (ev) {
            openURL(_this.href, ev, _this.routerDirection);
        };
    }
    class_1.prototype.componentDidLoad = function () {
        console.warn('[DEPRECATED][ion-anchor] The <ion-anchor> component has been deprecated. Please use an <ion-router-link> if you are using a vanilla JS or Stencil project or an <a> with the Angular router.');
    };
    class_1.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        var attrs = {
            href: this.href,
            rel: this.rel
        };
        return (h(Host, { onClick: this.onClick, class: Object.assign(Object.assign({}, createColorClasses(this.color)), (_a = {}, _a[mode] = true, _a['ion-activatable'] = true, _a)) }, h("a", Object.assign({}, attrs), h("slot", null))));
    };
    Object.defineProperty(class_1, "style", {
        get: function () { return ":host{--background:transparent;--color:var(--ion-color-primary,#3880ff);background:var(--background);color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}a{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { Anchor as ion_anchor };
