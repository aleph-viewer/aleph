import { r as registerInstance, c as createEvent } from './core-684c60cc.js';
var Route = /** @class */ (function () {
    function class_1(hostRef) {
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
    class_1.prototype.onUpdate = function (newValue) {
        this.ionRouteDataChanged.emit(newValue);
    };
    class_1.prototype.onComponentProps = function (newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }
        var keys1 = newValue ? Object.keys(newValue) : [];
        var keys2 = oldValue ? Object.keys(oldValue) : [];
        if (keys1.length !== keys2.length) {
            this.onUpdate(newValue);
            return;
        }
        for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
            var key = keys1_1[_i];
            if (newValue[key] !== oldValue[key]) {
                this.onUpdate(newValue);
                return;
            }
        }
    };
    class_1.prototype.connectedCallback = function () {
        this.ionRouteDataChanged.emit();
    };
    Object.defineProperty(class_1, "watchers", {
        get: function () {
            return {
                "url": ["onUpdate"],
                "component": ["onUpdate"],
                "componentProps": ["onComponentProps"]
            };
        },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { Route as ion_route };
