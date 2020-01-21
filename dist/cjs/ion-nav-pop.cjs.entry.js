'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');
const navLinkUtils = require('./nav-link-utils-25491828.js');

const NavPop = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
        this.pop = () => {
            return navLinkUtils.navLink(this.el, 'back');
        };
    }
    componentDidLoad() {
        console.warn('[DEPRECATED][ion-nav-pop] <ion-nav-pop> is deprecated. Use `<ion-nav-link routerDirection="back">` instead.');
    }
    render() {
        return (core.h(core.Host, { onClick: this.pop }));
    }
    get el() { return core.getElement(this); }
};

exports.ion_nav_pop = NavPop;
