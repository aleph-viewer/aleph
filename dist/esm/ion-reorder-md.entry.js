import { r as registerInstance, h, f as getIonMode, H as Host } from './core-684c60cc.js';

const Reorder = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    onClick(ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
    }
    render() {
        return (h(Host, { class: getIonMode(this) }, h("slot", null, h("ion-icon", { name: "reorder", lazy: false, class: "reorder-icon" }))));
    }
    static get style() { return ":host([slot]){display:none;line-height:0;z-index:100}.reorder-icon{display:block;font-size:22px;font-size:31px;opacity:.3}"; }
};

export { Reorder as ion_reorder };
