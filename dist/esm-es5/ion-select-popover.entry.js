import { r as registerInstance, h, f as getIonMode, H as Host } from './core-684c60cc.js';
import { s as safeCall } from './overlays-01f9eb21.js';
var SelectPopover = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
        /** Array of options for the popover */
        this.options = [];
    }
    class_1.prototype.onSelect = function (ev) {
        var option = this.options.find(function (o) { return o.value === ev.target.value; });
        if (option) {
            safeCall(option.handler);
        }
    };
    class_1.prototype.render = function () {
        return (h(Host, { class: getIonMode(this) }, h("ion-list", null, this.header !== undefined && h("ion-list-header", null, this.header), (this.subHeader !== undefined || this.message !== undefined) &&
            h("ion-item", null, h("ion-label", { class: "ion-text-wrap" }, this.subHeader !== undefined && h("h3", null, this.subHeader), this.message !== undefined && h("p", null, this.message))), h("ion-radio-group", null, this.options.map(function (option) { return h("ion-item", null, h("ion-label", null, option.text), h("ion-radio", { checked: option.checked, value: option.value, disabled: option.disabled })); })))));
    };
    Object.defineProperty(class_1, "style", {
        get: function () { return ".sc-ion-select-popover-h ion-list.sc-ion-select-popover{margin-left:0;margin-right:0;margin-top:-1px;margin-bottom:-1px}.sc-ion-select-popover-h ion-label.sc-ion-select-popover, .sc-ion-select-popover-h ion-list-header.sc-ion-select-popover{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { SelectPopover as ion_select_popover };
