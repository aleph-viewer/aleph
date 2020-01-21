'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');
const frameworkDelegate = require('./framework-delegate-0f9d18c1.js');
const cubicBezier = require('./cubic-bezier-afbd6a9b.js');
const index = require('./index-68aed157.js');

const RouterOutlet = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
        this.animationEnabled = true;
        /**
         * The mode determines which platform styles to use.
         */
        this.mode = core.getIonMode(this);
        /**
         * If `true`, the router-outlet should animate the transition of components.
         */
        this.animated = true;
        this.ionNavWillLoad = core.createEvent(this, "ionNavWillLoad", 7);
        this.ionNavWillChange = core.createEvent(this, "ionNavWillChange", 3);
        this.ionNavDidChange = core.createEvent(this, "ionNavDidChange", 3);
    }
    swipeHandlerChanged() {
        if (this.gesture) {
            this.gesture.setDisabled(this.swipeHandler === undefined);
        }
    }
    async connectedCallback() {
        this.gesture = (await new Promise(function (resolve) { resolve(require('./swipe-back-aee64258.js')); })).createSwipeBackGesture(this.el, () => !!this.swipeHandler && this.swipeHandler.canStart() && this.animationEnabled, () => this.swipeHandler && this.swipeHandler.onStart(), step => this.ani && this.ani.progressStep(step), (shouldComplete, step, dur) => {
            if (this.ani) {
                this.animationEnabled = false;
                this.ani.onFinish(() => {
                    this.animationEnabled = true;
                    if (this.swipeHandler) {
                        this.swipeHandler.onEnd(shouldComplete);
                    }
                }, { oneTimeCallback: true });
                // Account for rounding errors in JS
                let newStepValue = (shouldComplete) ? -0.001 : 0.001;
                /**
                 * Animation will be reversed here, so need to
                 * reverse the easing curve as well
                 *
                 * Additionally, we need to account for the time relative
                 * to the new easing curve, as `stepValue` is going to be given
                 * in terms of a linear curve.
                 */
                if (!shouldComplete) {
                    this.ani.easing('cubic-bezier(1, 0, 0.68, 0.28)');
                    newStepValue += cubicBezier.getTimeGivenProgression(new cubicBezier.Point(0, 0), new cubicBezier.Point(1, 0), new cubicBezier.Point(0.68, 0.28), new cubicBezier.Point(1, 1), step);
                }
                else {
                    newStepValue += cubicBezier.getTimeGivenProgression(new cubicBezier.Point(0, 0), new cubicBezier.Point(0.32, 0.72), new cubicBezier.Point(0, 1), new cubicBezier.Point(1, 1), step);
                }
                this.ani.progressEnd(shouldComplete ? 1 : 0, newStepValue, dur);
            }
        });
        this.swipeHandlerChanged();
    }
    componentWillLoad() {
        this.ionNavWillLoad.emit();
    }
    disconnectedCallback() {
        if (this.gesture) {
            this.gesture.destroy();
            this.gesture = undefined;
        }
    }
    /** @internal */
    async commit(enteringEl, leavingEl, opts) {
        const unlock = await this.lock();
        let changed = false;
        try {
            changed = await this.transition(enteringEl, leavingEl, opts);
        }
        catch (e) {
            console.error(e);
        }
        unlock();
        return changed;
    }
    /** @internal */
    async setRouteId(id, params, direction) {
        const changed = await this.setRoot(id, params, {
            duration: direction === 'root' ? 0 : undefined,
            direction: direction === 'back' ? 'back' : 'forward',
        });
        return {
            changed,
            element: this.activeEl
        };
    }
    /** @internal */
    async getRouteId() {
        const active = this.activeEl;
        return active ? {
            id: active.tagName,
            element: active,
        } : undefined;
    }
    async setRoot(component, params, opts) {
        if (this.activeComponent === component) {
            return false;
        }
        // attach entering view to DOM
        const leavingEl = this.activeEl;
        const enteringEl = await frameworkDelegate.attachComponent(this.delegate, this.el, component, ['ion-page', 'ion-page-invisible'], params);
        this.activeComponent = component;
        this.activeEl = enteringEl;
        // commit animation
        await this.commit(enteringEl, leavingEl, opts);
        await frameworkDelegate.detachComponent(this.delegate, leavingEl);
        return true;
    }
    async transition(enteringEl, leavingEl, opts = {}) {
        if (leavingEl === enteringEl) {
            return false;
        }
        // emit nav will change event
        this.ionNavWillChange.emit();
        const { el, mode } = this;
        const animated = this.animated && core.config.getBoolean('animated', true);
        const animationBuilder = this.animation || opts.animationBuilder || core.config.get('navAnimation');
        await index.transition(Object.assign({ mode,
            animated,
            animationBuilder,
            enteringEl,
            leavingEl, baseEl: el, progressCallback: (opts.progressAnimation
                ? ani => this.ani = ani
                : undefined) }, opts));
        // emit nav changed event
        this.ionNavDidChange.emit();
        return true;
    }
    async lock() {
        const p = this.waitPromise;
        let resolve;
        this.waitPromise = new Promise(r => resolve = r);
        if (p !== undefined) {
            await p;
        }
        return resolve;
    }
    render() {
        return (core.h("slot", null));
    }
    get el() { return core.getElement(this); }
    static get watchers() { return {
        "swipeHandler": ["swipeHandlerChanged"]
    }; }
    static get style() { return ":host{left:0;right:0;top:0;bottom:0;position:absolute;contain:layout size style;overflow:hidden;z-index:0}"; }
};

exports.ion_router_outlet = RouterOutlet;
