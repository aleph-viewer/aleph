import { r as registerInstance, h, d as getElement, H as Host } from './core-684c60cc.js';
import { n as navLink } from './nav-link-utils-7601dc1b.js';

const NavPop = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.pop = () => {
            return navLink(this.el, 'back');
        };
    }
    componentDidLoad() {
        console.warn('[DEPRECATED][ion-nav-pop] <ion-nav-pop> is deprecated. Use `<ion-nav-link routerDirection="back">` instead.');
    }
    render() {
        return (h(Host, { onClick: this.pop }));
    }
    get el() { return getElement(this); }
};

export { NavPop as ion_nav_pop };
