'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');
const overlays = require('./overlays-5a64fdf9.js');

const SelectPopover = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
        /** Array of options for the popover */
        this.options = [];
    }
    onSelect(ev) {
        const option = this.options.find(o => o.value === ev.target.value);
        if (option) {
            overlays.safeCall(option.handler);
        }
    }
    render() {
        return (core.h(core.Host, { class: core.getIonMode(this) }, core.h("ion-list", null, this.header !== undefined && core.h("ion-list-header", null, this.header), (this.subHeader !== undefined || this.message !== undefined) &&
            core.h("ion-item", null, core.h("ion-label", { class: "ion-text-wrap" }, this.subHeader !== undefined && core.h("h3", null, this.subHeader), this.message !== undefined && core.h("p", null, this.message))), core.h("ion-radio-group", null, this.options.map(option => core.h("ion-item", null, core.h("ion-label", null, option.text), core.h("ion-radio", { checked: option.checked, value: option.value, disabled: option.disabled })))))));
    }
    static get style() { return ".sc-ion-select-popover-h ion-list.sc-ion-select-popover{margin-left:0;margin-right:0;margin-top:-1px;margin-bottom:-1px}.sc-ion-select-popover-h ion-label.sc-ion-select-popover, .sc-ion-select-popover-h ion-list-header.sc-ion-select-popover{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}"; }
};

exports.ion_select_popover = SelectPopover;
