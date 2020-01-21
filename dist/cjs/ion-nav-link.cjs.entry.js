'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');
const navLinkUtils = require('./nav-link-utils-25491828.js');

const NavLink = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
        /**
         * The transition direction when navigating to another page.
         */
        this.routerDirection = 'forward';
        this.onClick = () => {
            return navLinkUtils.navLink(this.el, this.routerDirection, this.component, this.componentProps);
        };
    }
    render() {
        return (core.h(core.Host, { onClick: this.onClick }));
    }
    get el() { return core.getElement(this); }
};

exports.ion_nav_link = NavLink;
