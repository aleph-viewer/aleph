'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');
const index = require('./index-9ebd02e0.js');

const RefresherContent = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
    }
    componentWillLoad() {
        if (this.pullingIcon === undefined) {
            this.pullingIcon = core.config.get('refreshingIcon', 'arrow-down');
        }
        if (this.refreshingSpinner === undefined) {
            const mode = core.getIonMode(this);
            this.refreshingSpinner = core.config.get('refreshingSpinner', core.config.get('spinner', mode === 'ios' ? 'lines' : 'crescent'));
        }
    }
    render() {
        return (core.h(core.Host, { class: core.getIonMode(this) }, core.h("div", { class: "refresher-pulling" }, this.pullingIcon &&
            core.h("div", { class: "refresher-pulling-icon" }, core.h("ion-icon", { icon: this.pullingIcon, lazy: false })), this.pullingText &&
            core.h("div", { class: "refresher-pulling-text", innerHTML: index.sanitizeDOMString(this.pullingText) })), core.h("div", { class: "refresher-refreshing" }, this.refreshingSpinner &&
            core.h("div", { class: "refresher-refreshing-icon" }, core.h("ion-spinner", { name: this.refreshingSpinner })), this.refreshingText &&
            core.h("div", { class: "refresher-refreshing-text", innerHTML: index.sanitizeDOMString(this.refreshingText) }))));
    }
};

exports.ion_refresher_content = RefresherContent;
