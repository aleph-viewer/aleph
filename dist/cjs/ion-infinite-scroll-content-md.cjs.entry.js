'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');
const index = require('./index-9ebd02e0.js');

const InfiniteScrollContent = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
    }
    componentDidLoad() {
        if (this.loadingSpinner === undefined) {
            const mode = core.getIonMode(this);
            this.loadingSpinner = core.config.get('infiniteLoadingSpinner', core.config.get('spinner', mode === 'ios' ? 'lines' : 'crescent'));
        }
    }
    render() {
        const mode = core.getIonMode(this);
        return (core.h(core.Host, { class: {
                [mode]: true,
                // Used internally for styling
                [`infinite-scroll-content-${mode}`]: true
            } }, core.h("div", { class: "infinite-loading" }, this.loadingSpinner && (core.h("div", { class: "infinite-loading-spinner" }, core.h("ion-spinner", { name: this.loadingSpinner }))), this.loadingText && (core.h("div", { class: "infinite-loading-text", innerHTML: index.sanitizeDOMString(this.loadingText) })))));
    }
    static get style() { return "ion-infinite-scroll-content{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center;min-height:84px;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.infinite-loading{margin-left:0;margin-right:0;margin-top:0;margin-bottom:32px;display:none;width:100%}.infinite-loading-text{margin-left:32px;margin-right:32px;margin-top:4px;margin-bottom:0}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.infinite-loading-text{margin-left:unset;margin-right:unset;-webkit-margin-start:32px;margin-inline-start:32px;-webkit-margin-end:32px;margin-inline-end:32px}}.infinite-scroll-loading ion-infinite-scroll-content>.infinite-loading{display:block}.infinite-scroll-content-md .infinite-loading-text{color:var(--ion-color-step-600,#666)}.infinite-scroll-content-md .infinite-loading-spinner .spinner-crescent circle,.infinite-scroll-content-md .infinite-loading-spinner .spinner-lines-md line,.infinite-scroll-content-md .infinite-loading-spinner .spinner-lines-small-md line{stroke:var(--ion-color-step-600,#666)}.infinite-scroll-content-md .infinite-loading-spinner .spinner-bubbles circle,.infinite-scroll-content-md .infinite-loading-spinner .spinner-circles circle,.infinite-scroll-content-md .infinite-loading-spinner .spinner-dots circle{fill:var(--ion-color-step-600,#666)}"; }
};

exports.ion_infinite_scroll_content = InfiniteScrollContent;
