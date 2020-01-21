import { r as registerInstance, i as config, f as getIonMode, h, H as Host } from './core-684c60cc.js';
import { s as sanitizeDOMString } from './index-fbd2c40b.js';

const RefresherContent = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    componentWillLoad() {
        if (this.pullingIcon === undefined) {
            this.pullingIcon = config.get('refreshingIcon', 'arrow-down');
        }
        if (this.refreshingSpinner === undefined) {
            const mode = getIonMode(this);
            this.refreshingSpinner = config.get('refreshingSpinner', config.get('spinner', mode === 'ios' ? 'lines' : 'crescent'));
        }
    }
    render() {
        return (h(Host, { class: getIonMode(this) }, h("div", { class: "refresher-pulling" }, this.pullingIcon &&
            h("div", { class: "refresher-pulling-icon" }, h("ion-icon", { icon: this.pullingIcon, lazy: false })), this.pullingText &&
            h("div", { class: "refresher-pulling-text", innerHTML: sanitizeDOMString(this.pullingText) })), h("div", { class: "refresher-refreshing" }, this.refreshingSpinner &&
            h("div", { class: "refresher-refreshing-icon" }, h("ion-spinner", { name: this.refreshingSpinner })), this.refreshingText &&
            h("div", { class: "refresher-refreshing-text", innerHTML: sanitizeDOMString(this.refreshingText) }))));
    }
};

export { RefresherContent as ion_refresher_content };
