import { r as registerInstance, f as getIonMode, h, H as Host } from './core-684c60cc.js';
import { c as createColorClasses } from './theme-955ba954.js';

const Text = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { class: Object.assign(Object.assign({}, createColorClasses(this.color)), { [mode]: true }) }, h("slot", null)));
    }
    static get style() { return ":host(.ion-color){color:var(--ion-color-base)}"; }
};

export { Text as ion_text };
