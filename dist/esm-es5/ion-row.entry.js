import { r as registerInstance, h, f as getIonMode, H as Host } from './core-684c60cc.js';
var Row = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
    }
    class_1.prototype.render = function () {
        return (h(Host, { class: getIonMode(this) }, h("slot", null)));
    };
    Object.defineProperty(class_1, "style", {
        get: function () { return ":host{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { Row as ion_row };
