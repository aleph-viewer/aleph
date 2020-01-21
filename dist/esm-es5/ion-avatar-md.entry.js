import { r as registerInstance, h, f as getIonMode, H as Host } from './core-684c60cc.js';
var Avatar = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
    }
    class_1.prototype.render = function () {
        return (h(Host, { class: getIonMode(this) }, h("slot", null)));
    };
    Object.defineProperty(class_1, "style", {
        get: function () { return ":host{border-radius:var(--border-radius);display:block}::slotted(img),::slotted(ion-img){border-radius:var(--border-radius);width:100%;height:100%;-o-object-fit:cover;object-fit:cover;overflow:hidden}:host{--border-radius:50%;width:64px;height:64px}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { Avatar as ion_avatar };
