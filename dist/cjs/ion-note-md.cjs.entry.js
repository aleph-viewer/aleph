'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');
const theme = require('./theme-b33a32a5.js');

const Note = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
    }
    render() {
        const mode = core.getIonMode(this);
        return (core.h(core.Host, { class: Object.assign(Object.assign({}, theme.createColorClasses(this.color)), { [mode]: true }) }, core.h("slot", null)));
    }
    static get style() { return ":host{color:var(--color);font-family:var(--ion-font-family,inherit);-webkit-box-sizing:border-box;box-sizing:border-box}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-600,#666);font-size:14px}"; }
};

exports.ion_note = Note;
