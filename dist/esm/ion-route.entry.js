import { r as registerInstance, c as createEvent } from './core-684c60cc.js';

const Route = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Relative path that needs to match in order for this route to apply.
         *
         * Accepts paths similar to expressjs so that you can define parameters
         * in the url /foo/:bar where bar would be available in incoming props.
         */
        this.url = '';
        this.ionRouteDataChanged = createEvent(this, "ionRouteDataChanged", 7);
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

export { Route as ion_route };
