import { r as registerInstance, f as getIonMode, h, H as Host } from './core-684c60cc.js';
import { c as createColorClasses } from './theme-955ba954.js';
var Text = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
    }
    class_1.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        return (h(Host, { class: Object.assign(Object.assign({}, createColorClasses(this.color)), (_a = {}, _a[mode] = true, _a)) }, h("slot", null)));
    };
    Object.defineProperty(class_1, "style", {
        get: function () { return ":host(.ion-color){color:var(--ion-color-base)}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { Text as ion_text };
