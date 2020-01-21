import { r as registerInstance, h, f as getIonMode, H as Host } from './core-684c60cc.js';
var Thumbnail = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
    }
    class_1.prototype.render = function () {
        return (h(Host, { class: getIonMode(this) }, h("slot", null)));
    };
    Object.defineProperty(class_1, "style", {
        get: function () { return ":host{--size:48px;--border-radius:0;border-radius:var(--border-radius);display:block;width:var(--size);height:var(--size)}::slotted(img),::slotted(ion-img){border-radius:var(--border-radius);width:100%;height:100%;-o-object-fit:cover;object-fit:cover;overflow:hidden}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { Thumbnail as ion_thumbnail };
