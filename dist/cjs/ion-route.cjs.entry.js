'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-c0ba63d2.js');

const Route = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
        /**
         * Relative path that needs to match in order for this route to apply.
         *
         * Accepts paths similar to expressjs so that you can define parameters
         * in the url /foo/:bar where bar would be available in incoming props.
         */
        this.url = '';
        this.ionRouteDataChanged = core.createEvent(this, "ionRouteDataChanged", 7);
    }
    onUpdate(newValue) {
        this.ionRouteDataChanged.emit(newValue);
    }
    onComponentProps(newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }
        const keys1 = newValue ? Object.keys(newValue) : [];
        const keys2 = oldValue ? Object.keys(oldValue) : [];
        if (keys1.length !== keys2.length) {
            this.onUpdate(newValue);
            return;
        }
        for (const key of keys1) {
            if (newValue[key] !== oldValue[key]) {
                this.onUpdate(newValue);
                return;
            }
        }
    }
    connectedCallback() {
        this.ionRouteDataChanged.emit();
    }
    static get watchers() { return {
        "url": ["onUpdate"],
        "component": ["onUpdate"],
        "componentProps": ["onComponentProps"]
    }; }
};

exports.ion_route = Route;
