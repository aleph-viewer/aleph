'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');
const navLinkUtils = require('./nav-link-utils-25491828.js');

const NavPush = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
        this.push = () => {
            return navLinkUtils.navLink(this.el, 'forward', this.component, this.componentProps);
        };
    }
    componentDidLoad() {
        console.warn('[DEPRECATED][ion-nav-push] `<ion-nav-push component="MyComponent">` is deprecated. Use `<ion-nav-link component="MyComponent">` instead.');
    }
    render() {
        return (core.h(core.Host, { onClick: this.push }));
    }
    get el() { return core.getElement(this); }
};

exports.ion_nav_push = NavPush;
