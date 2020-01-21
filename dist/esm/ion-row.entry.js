import { r as registerInstance, h, f as getIonMode, H as Host } from './core-684c60cc.js';

const Row = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, { class: getIonMode(this) }, h("slot", null)));
    }
    static get style() { return ":host{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap}"; }
};

export { Row as ion_row };
