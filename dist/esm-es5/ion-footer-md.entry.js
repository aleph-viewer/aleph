import { r as registerInstance, f as getIonMode, h, H as Host } from './core-684c60cc.js';
var Footer = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
        /**
         * If `true`, the footer will be translucent.
         * Only applies when the mode is `"ios"` and the device supports
         * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
         *
         * Note: In order to scroll content behind the footer, the `fullscreen`
         * attribute needs to be set on the content.
         */
        this.translucent = false;
    }
    class_1.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        var translucent = this.translucent;
        return (h(Host, { role: "contentinfo", class: (_a = {},
                _a[mode] = true,
                // Used internally for styling
                _a["footer-" + mode] = true,
                _a["footer-translucent"] = translucent,
                _a["footer-translucent-" + mode] = translucent,
                _a) }));
    };
    Object.defineProperty(class_1, "style", {
        get: function () { return "ion-footer{display:block;position:relative;-ms-flex-order:1;order:1;width:100%;z-index:10}ion-footer ion-toolbar:last-child{padding-bottom:var(--ion-safe-area-bottom,0)}.footer-md:before{left:0;top:-2px;bottom:auto;background-position:left 0 top 0;position:absolute;width:100%;height:2px;background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAHBAMAAADzDtBxAAAAD1BMVEUAAAAAAAAAAAAAAAAAAABPDueNAAAABXRSTlMUCS0gBIh/TXEAAAAaSURBVAjXYxCEAgY4UIICBmMogMsgFLtAAQCNSwXZKOdPxgAAAABJRU5ErkJggg==\");background-repeat:repeat-x;content:\"\"}:host-context([dir=rtl]) .footer-md:before,[dir=rtl] .footer-md:before{left:unset;right:unset;right:0;background-position:right 0 top 0}.footer-md[no-border]:before{display:none}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { Footer as ion_footer };
