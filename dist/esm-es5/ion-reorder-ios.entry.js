import { r as registerInstance, h, f as getIonMode, H as Host } from './core-684c60cc.js';
var Reorder = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
    }
    class_1.prototype.onClick = function (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
    };
    class_1.prototype.render = function () {
        return (h(Host, { class: getIonMode(this) }, h("slot", null, h("ion-icon", { name: "reorder", lazy: false, class: "reorder-icon" }))));
    };
    Object.defineProperty(class_1, "style", {
        get: function () { return ":host([slot]){display:none;line-height:0;z-index:100}.reorder-icon{display:block;font-size:22px;font-size:34px;opacity:.4}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { Reorder as ion_reorder };
