import { r as registerInstance, i as config, f as getIonMode, h, H as Host, d as getElement } from './core-684c60cc.js';
import { h as hostContext } from './theme-955ba954.js';

const SkeletonText = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * If `true`, the skeleton text will animate.
         */
        this.animated = false;
    }
    calculateWidth() {
        // If width was passed in to the property use that first
        // tslint:disable-next-line: deprecation
        if (this.width !== undefined) {
            return {
                style: {
                    // tslint:disable-next-line: deprecation
                    width: this.width
                }
            };
        }
        return;
    }
    render() {
        const animated = this.animated && config.getBoolean('animated', true);
        const inMedia = hostContext('ion-avatar', this.el) || hostContext('ion-thumbnail', this.el);
        const mode = getIonMode(this);
        return (h(Host, Object.assign({ class: {
                [mode]: true,
                'skeleton-text-animated': animated,
                'in-media': inMedia
            } }, this.calculateWidth()), h("span", null, "\u00A0")));
    }
    get el() { return getElement(this); }
    static get style() { return ":host{--background:rgba(var(--background-rgb,var(--ion-text-color-rgb,0,0,0)),0.065);border-radius:var(--border-radius,inherit);display:block;width:100%;height:inherit;margin-top:4px;margin-bottom:4px;background:var(--background);line-height:10px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}span{display:inline-block}:host(.in-media){margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;height:100%}:host(.skeleton-text-animated){position:relative;background:-webkit-gradient(linear,left top,right top,color-stop(8%,rgba(var(--background-rgb,var(--ion-text-color-rgb,0,0,0)),.065)),color-stop(18%,rgba(var(--background-rgb,var(--ion-text-color-rgb,0,0,0)),.135)),color-stop(33%,rgba(var(--background-rgb,var(--ion-text-color-rgb,0,0,0)),.065)));background:linear-gradient(90deg,rgba(var(--background-rgb,var(--ion-text-color-rgb,0,0,0)),.065) 8%,rgba(var(--background-rgb,var(--ion-text-color-rgb,0,0,0)),.135) 18%,rgba(var(--background-rgb,var(--ion-text-color-rgb,0,0,0)),.065) 33%);background-size:800px 104px;-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-name:shimmer;animation-name:shimmer;-webkit-animation-timing-function:linear;animation-timing-function:linear}\@-webkit-keyframes shimmer{0%{background-position:-468px 0}to{background-position:468px 0}}\@keyframes shimmer{0%{background-position:-468px 0}to{background-position:468px 0}}"; }
};

export { SkeletonText as ion_skeleton_text };
