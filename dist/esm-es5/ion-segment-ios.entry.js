import { r as registerInstance, c as createEvent, f as getIonMode, h, H as Host, d as getElement } from './core-684c60cc.js';
import { c as createColorClasses } from './theme-955ba954.js';
var Segment = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
        this.didInit = false;
        /**
         * If `true`, the user cannot interact with the segment.
         */
        this.disabled = false;
        /**
         * If `true`, the segment buttons will overflow and the user can swipe to see them.
         */
        this.scrollable = false;
        this.ionChange = createEvent(this, "ionChange", 7);
        this.ionStyle = createEvent(this, "ionStyle", 7);
    }
    class_1.prototype.valueChanged = function (value) {
        if (this.didInit) {
            this.updateButtons();
            this.ionChange.emit({ value: value });
        }
    };
    class_1.prototype.segmentClick = function (ev) {
        var selectedButton = ev.target;
        this.value = selectedButton.value;
    };
    class_1.prototype.connectedCallback = function () {
        if (this.value === undefined) {
            var checked = this.getButtons().find(function (b) { return b.checked; });
            if (checked) {
                this.value = checked.value;
            }
        }
        this.emitStyle();
    };
    class_1.prototype.componentDidLoad = function () {
        this.updateButtons();
        this.didInit = true;
    };
    class_1.prototype.emitStyle = function () {
        this.ionStyle.emit({
            'segment': true
        });
    };
    class_1.prototype.updateButtons = function () {
        var value = this.value;
        for (var _i = 0, _a = this.getButtons(); _i < _a.length; _i++) {
            var button = _a[_i];
            button.checked = (button.value === value);
        }
    };
    class_1.prototype.getButtons = function () {
        return Array.from(this.el.querySelectorAll('ion-segment-button'));
    };
    class_1.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        return (h(Host, { class: Object.assign(Object.assign({}, createColorClasses(this.color)), (_a = {}, _a[mode] = true, _a['segment-disabled'] = this.disabled, _a['segment-scrollable'] = this.scrollable, _a)) }));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "watchers", {
        get: function () {
            return {
                "value": ["valueChanged"]
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "style", {
        get: function () { return ".sc-ion-segment-ios-h{--indicator-color-checked:initial;--ripple-color:currentColor;--color-activated:initial;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;-ms-flex-align:stretch;align-items:stretch;-ms-flex-pack:center;justify-content:center;width:100%;font-family:var(--ion-font-family,inherit);text-align:center}.sc-ion-segment-ios-s > .segment-button-disabled, .segment-disabled.sc-ion-segment-ios-h{pointer-events:none}.segment-scrollable.sc-ion-segment-ios-h{-ms-flex-pack:start;justify-content:start;width:auto;overflow-x:scroll}.segment-scrollable.sc-ion-segment-ios-h::-webkit-scrollbar{display:none}.sc-ion-segment-ios-h{--background:transparent;--background-hover:rgba(var(--ion-color-primary-rgb,56,128,255),0.1);--background-activated:rgba(var(--ion-color-primary-rgb,56,128,255),0.16);--background-checked:var(--ion-color-primary,#3880ff);--color:var(--ion-color-primary,#3880ff);--color-checked:var(--ion-color-primary-contrast,#fff);--color-disabled:rgba(var(--ion-color-primary-rgb,56,128,255),0.3);--color-checked-disabled:rgba(var(--ion-color-primary-contrast-rgb,255,255,255),0.3);--border-color:var(--ion-color-primary,#3880ff);--indicator-color:transparent}.segment-disabled.sc-ion-segment-ios-h{opacity:.3}.sc-ion-segment-ios-h.ion-color.sc-ion-segment-ios-s > ion-segment-button{--border-color:var(--ion-color-base);background:transparent;color:var(--ion-color-base)}.sc-ion-segment-ios-h.ion-color.sc-ion-segment-ios-s > .activated{background:rgba(var(--ion-color-base-rgb),.16);color:var(--ion-color-base)}.sc-ion-segment-ios-h.ion-color.sc-ion-segment-ios-s > .segment-button-checked, .sc-ion-segment-ios-h.ion-color.sc-ion-segment-ios-s > .segment-button-checked.activated{background:var(--ion-color-base);color:var(--ion-color-contrast)}.sc-ion-segment-ios-h.ion-color.sc-ion-segment-ios-s > .segment-button-disabled{color:rgba(var(--ion-color-base-rgb),.3)}.sc-ion-segment-ios-h.ion-color.sc-ion-segment-ios-s > .segment-button-checked.segment-button-disabled{color:rgba(var(--ion-color-contrast-rgb),.3)}\@media (any-hover:hover){.sc-ion-segment-ios-h.ion-color.sc-ion-segment-ios-s > ion-segment-button:hover:not(.segment-button-checked){background:rgba(var(--ion-color-base-rgb),.1)}}.sc-ion-segment-ios-hion-toolbar.sc-ion-segment-ios-s > ion-segment-button, ion-toolbar .sc-ion-segment-ios-h.sc-ion-segment-ios-s > ion-segment-button{max-width:100px;font-size:12px;line-height:22px}.sc-ion-segment-ios-hion-toolbar:not(.ion-color):not(.ion-color).sc-ion-segment-ios-s > ion-segment-button, ion-toolbar:not(.ion-color) .sc-ion-segment-ios-h:not(.ion-color).sc-ion-segment-ios-s > ion-segment-button{border-color:var(--ion-toolbar-color-checked,var(--border-color));color:var(--ion-toolbar-color-unchecked,var(--color))}.sc-ion-segment-ios-hion-toolbar:not(.ion-color):not(.ion-color).sc-ion-segment-ios-s > .segment-button-checked, ion-toolbar:not(.ion-color) .sc-ion-segment-ios-h:not(.ion-color).sc-ion-segment-ios-s > .segment-button-checked{background:var(--ion-toolbar-color-checked,var(--background-checked));color:var(--ion-toolbar-background,var(--color-checked))}.sc-ion-segment-ios-hion-toolbar.ion-color:not(.ion-color).sc-ion-segment-ios-s > ion-segment-button, ion-toolbar.ion-color .sc-ion-segment-ios-h:not(.ion-color).sc-ion-segment-ios-s > ion-segment-button{--color:var(--ion-color-contrast);--color-disabled:rgba(var(--ion-color-contrast-rgb),0.3);--color-checked:var(--ion-color-base);--color-checked-disabled:rgba(var(--ion-color-contrast-rgb),0.3);--background-hover:rgba(var(--ion-color-contrast-rgb),0.1);--background-activated:rgba(var(--ion-color-contrast-rgb),0.16);--background-checked:var(--ion-color-contrast);--border-color:var(--ion-color-contrast)}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { Segment as ion_segment };
