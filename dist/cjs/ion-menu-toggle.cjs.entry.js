'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');
require('./helpers-cb44ca7a.js');
require('./animation-02eb4fcf.js');
const index$1 = require('./index-8b27a14a.js');
const menuToggleUtil = require('./menu-toggle-util-1fb02c26.js');

const MenuToggle = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
        this.visible = false;
        /**
         * Automatically hides the content when the corresponding menu is not active.
         *
         * By default, it's `true`. Change it to `false` in order to
         * keep `ion-menu-toggle` always visible regardless the state of the menu.
         */
        this.autoHide = true;
        this.onClick = () => {
            return index$1.menuController.toggle(this.menu);
        };
    }
    connectedCallback() {
        this.visibilityChanged();
    }
    async visibilityChanged() {
        this.visible = await menuToggleUtil.updateVisibility(this.menu);
    }
    render() {
        const mode = core.getIonMode(this);
        const hidden = this.autoHide && !this.visible;
        return (core.h(core.Host, { onClick: this.onClick, "aria-hidden": hidden ? 'true' : null, class: {
                [mode]: true,
                'menu-toggle-hidden': hidden,
            } }, core.h("slot", null)));
    }
    static get style() { return ":host(.menu-toggle-hidden){display:none}"; }
};

exports.ion_menu_toggle = MenuToggle;
