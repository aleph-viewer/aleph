'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');
const theme = require('./theme-b33a32a5.js');

const Anchor = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
        /**
         * When using a router, it specifies the transition direction when navigating to
         * another page using `href`.
         */
        this.routerDirection = 'forward';
        this.onClick = (ev) => {
            theme.openURL(this.href, ev, this.routerDirection);
        };
    }
    componentDidLoad() {
        console.warn('[DEPRECATED][ion-anchor] The <ion-anchor> component has been deprecated. Please use an <ion-router-link> if you are using a vanilla JS or Stencil project or an <a> with the Angular router.');
    }
    render() {
        const mode = core.getIonMode(this);
        const attrs = {
            href: this.href,
            rel: this.rel
        };
        return (core.h(core.Host, { onClick: this.onClick, class: Object.assign(Object.assign({}, theme.createColorClasses(this.color)), { [mode]: true, 'ion-activatable': true }) }, core.h("a", Object.assign({}, attrs), core.h("slot", null))));
    }
    static get style() { return ":host{--background:transparent;--color:var(--ion-color-primary,#3880ff);background:var(--background);color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}a{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit}"; }
};

exports.ion_anchor = Anchor;
