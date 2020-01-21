import { r as registerInstance, f as getIonMode, h, H as Host } from './core-684c60cc.js';
var Slide = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
    }
    class_1.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        return (h(Host, { class: (_a = {},
                _a[mode] = true,
                _a['swiper-slide'] = true,
                _a['swiper-zoom-container'] = true,
                _a) }));
    };
    Object.defineProperty(class_1, "style", {
        get: function () { return "ion-slide{height:100%}.slide-zoom,ion-slide{display:block;width:100%}.slide-zoom,.swiper-slide{text-align:center}.swiper-slide{display:-ms-flexbox;display:flex;position:relative;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;font-size:18px;-webkit-box-sizing:border-box;box-sizing:border-box}.swiper-slide img{width:auto;max-width:100%;height:auto;max-height:100%}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { Slide as ion_slide };
