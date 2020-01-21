var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { r as registerInstance, f as getIonMode, c as createEvent, j as isPlatform, m as readTask, i as config, h, H as Host, d as getElement } from './core-684c60cc.js';
import { c as createColorClasses, h as hostContext } from './theme-955ba954.js';
var Content = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
        this.isScrolling = false;
        this.lastScroll = 0;
        this.queued = false;
        this.cTop = -1;
        this.cBottom = -1;
        this.mode = getIonMode(this);
        // Detail is used in a hot loop in the scroll event, by allocating it here
        // V8 will be able to inline any read/write to it since it's a monomorphic class.
        // https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html
        this.detail = {
            scrollTop: 0,
            scrollLeft: 0,
            type: 'scroll',
            event: undefined,
            startX: 0,
            startY: 0,
            startTimeStamp: 0,
            currentX: 0,
            currentY: 0,
            velocityX: 0,
            velocityY: 0,
            deltaX: 0,
            deltaY: 0,
            timeStamp: 0,
            data: undefined,
            isScrolling: true,
        };
        /**
         * If `true`, the content will scroll behind the headers
         * and footers. This effect can easily be seen by setting the toolbar
         * to transparent.
         */
        this.fullscreen = false;
        /**
         * If you want to enable the content scrolling in the X axis, set this property to `true`.
         */
        this.scrollX = false;
        /**
         * If you want to disable the content scrolling in the Y axis, set this property to `false`.
         */
        this.scrollY = true;
        /**
         * Because of performance reasons, ionScroll events are disabled by default, in order to enable them
         * and start listening from (ionScroll), set this property to `true`.
         */
        this.scrollEvents = false;
        this.ionScrollStart = createEvent(this, "ionScrollStart", 7);
        this.ionScroll = createEvent(this, "ionScroll", 7);
        this.ionScrollEnd = createEvent(this, "ionScrollEnd", 7);
    }
    class_1.prototype.disconnectedCallback = function () {
        this.onScrollEnd();
    };
    class_1.prototype.componentDidLoad = function () {
        this.resize();
    };
    class_1.prototype.onClick = function (ev) {
        if (this.isScrolling) {
            ev.preventDefault();
            ev.stopPropagation();
        }
    };
    class_1.prototype.shouldForceOverscroll = function () {
        var _a = this, forceOverscroll = _a.forceOverscroll, mode = _a.mode;
        return forceOverscroll === undefined
            ? mode === 'ios' && isPlatform('ios')
            : forceOverscroll;
    };
    class_1.prototype.resize = function () {
        if (this.fullscreen) {
            readTask(this.readDimensions.bind(this));
        }
        else if (this.cTop !== 0 || this.cBottom !== 0) {
            this.cTop = this.cBottom = 0;
            this.el.forceUpdate();
        }
    };
    class_1.prototype.readDimensions = function () {
        var page = getPageElement(this.el);
        var top = Math.max(this.el.offsetTop, 0);
        var bottom = Math.max(page.offsetHeight - top - this.el.offsetHeight, 0);
        var dirty = top !== this.cTop || bottom !== this.cBottom;
        if (dirty) {
            this.cTop = top;
            this.cBottom = bottom;
            this.el.forceUpdate();
        }
    };
    class_1.prototype.onScroll = function (ev) {
        var _this = this;
        var timeStamp = Date.now();
        var shouldStart = !this.isScrolling;
        this.lastScroll = timeStamp;
        if (shouldStart) {
            this.onScrollStart();
        }
        if (!this.queued && this.scrollEvents) {
            this.queued = true;
            readTask(function (ts) {
                _this.queued = false;
                _this.detail.event = ev;
                updateScrollDetail(_this.detail, _this.scrollEl, ts, shouldStart);
                _this.ionScroll.emit(_this.detail);
            });
        }
    };
    /**
     * Get the element where the actual scrolling takes place.
     * This element can be used to subscribe to `scroll` events or manually modify
     * `scrollTop`. However, it's recommended to use the API provided by `ion-content`:
     *
     * i.e. Using `ionScroll`, `ionScrollStart`, `ionScrollEnd` for scrolling events
     * and `scrollToPoint()` to scroll the content into a certain point.
     */
    class_1.prototype.getScrollElement = function () {
        return Promise.resolve(this.scrollEl);
    };
    /**
     * Scroll to the top of the component.
     *
     * @param duration The amount of time to take scrolling to the top. Defaults to `0`.
     */
    class_1.prototype.scrollToTop = function (duration) {
        if (duration === void 0) { duration = 0; }
        return this.scrollToPoint(undefined, 0, duration);
    };
    /**
     * Scroll to the bottom of the component.
     *
     * @param duration The amount of time to take scrolling to the bottom. Defaults to `0`.
     */
    class_1.prototype.scrollToBottom = function (duration) {
        if (duration === void 0) { duration = 0; }
        var y = this.scrollEl.scrollHeight - this.scrollEl.clientHeight;
        return this.scrollToPoint(undefined, y, duration);
    };
    /**
     * Scroll by a specified X/Y distance in the component.
     *
     * @param x The amount to scroll by on the horizontal axis.
     * @param y The amount to scroll by on the vertical axis.
     * @param duration The amount of time to take scrolling by that amount.
     */
    class_1.prototype.scrollByPoint = function (x, y, duration) {
        return this.scrollToPoint(x + this.scrollEl.scrollLeft, y + this.scrollEl.scrollTop, duration);
    };
    /**
     * Scroll to a specified X/Y location in the component.
     *
     * @param x The point to scroll to on the horizontal axis.
     * @param y The point to scroll to on the vertical axis.
     * @param duration The amount of time to take scrolling to that point. Defaults to `0`.
     */
    class_1.prototype.scrollToPoint = function (x, y, duration) {
        if (duration === void 0) { duration = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var el, resolve, startTime, promise, fromY, fromX, deltaY, deltaX, step;
            return __generator(this, function (_a) {
                el = this.scrollEl;
                if (duration < 32) {
                    if (y != null) {
                        el.scrollTop = y;
                    }
                    if (x != null) {
                        el.scrollLeft = x;
                    }
                    return [2 /*return*/];
                }
                startTime = 0;
                promise = new Promise(function (r) { return resolve = r; });
                fromY = el.scrollTop;
                fromX = el.scrollLeft;
                deltaY = y != null ? y - fromY : 0;
                deltaX = x != null ? x - fromX : 0;
                step = function (timeStamp) {
                    var linearTime = Math.min(1, ((timeStamp - startTime) / duration)) - 1;
                    var easedT = Math.pow(linearTime, 3) + 1;
                    if (deltaY !== 0) {
                        el.scrollTop = Math.floor((easedT * deltaY) + fromY);
                    }
                    if (deltaX !== 0) {
                        el.scrollLeft = Math.floor((easedT * deltaX) + fromX);
                    }
                    if (easedT < 1) {
                        // do not use DomController here
                        // must use nativeRaf in order to fire in the next frame
                        // TODO: remove as any
                        requestAnimationFrame(step);
                    }
                    else {
                        resolve();
                    }
                };
                // chill out for a frame first
                requestAnimationFrame(function (ts) {
                    startTime = ts;
                    step(ts);
                });
                return [2 /*return*/, promise];
            });
        });
    };
    class_1.prototype.onScrollStart = function () {
        var _this = this;
        this.isScrolling = true;
        this.ionScrollStart.emit({
            isScrolling: true
        });
        if (this.watchDog) {
            clearInterval(this.watchDog);
        }
        // watchdog
        this.watchDog = setInterval(function () {
            if (_this.lastScroll < Date.now() - 120) {
                _this.onScrollEnd();
            }
        }, 100);
    };
    class_1.prototype.onScrollEnd = function () {
        clearInterval(this.watchDog);
        this.watchDog = null;
        if (this.isScrolling) {
            this.isScrolling = false;
            this.ionScrollEnd.emit({
                isScrolling: false
            });
        }
    };
    class_1.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this, scrollX = _b.scrollX, scrollY = _b.scrollY;
        var mode = getIonMode(this);
        var forceOverscroll = this.shouldForceOverscroll();
        var transitionShadow = (mode === 'ios' && config.getBoolean('experimentalTransitionShadow', true));
        this.resize();
        return (h(Host, { class: Object.assign(Object.assign({}, createColorClasses(this.color)), (_a = {}, _a[mode] = true, _a['content-sizing'] = hostContext('ion-popover', this.el), _a['overscroll'] = forceOverscroll, _a)), style: {
                '--offset-top': this.cTop + "px",
                '--offset-bottom': this.cBottom + "px",
            } }, h("main", { class: {
                'inner-scroll': true,
                'scroll-x': scrollX,
                'scroll-y': scrollY,
                'overscroll': (scrollX || scrollY) && forceOverscroll
            }, ref: function (el) { return _this.scrollEl = el; }, onScroll: function (ev) { return _this.onScroll(ev); } }, h("slot", null)), transitionShadow ? (h("div", { class: "transition-effect" }, h("div", { class: "transition-cover" }), h("div", { class: "transition-shadow" }))) : null, h("slot", { name: "fixed" })));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "style", {
        get: function () { return ":host{--background:var(--ion-background-color,#fff);--color:var(--ion-text-color,#000);--padding-top:0px;--padding-bottom:0px;--padding-start:0px;--padding-end:0px;--keyboard-offset:0px;--offset-top:0px;--offset-bottom:0px;--overflow:auto;display:block;position:relative;-ms-flex:1;flex:1;width:100%;height:100%;margin:0!important;padding:0!important;font-family:var(--ion-font-family,inherit);contain:size style}:host(.ion-color) .inner-scroll{background:var(--ion-color-base);color:var(--ion-color-contrast)}:host(.outer-content){--background:var(--ion-color-step-50,#f2f2f2)}.inner-scroll{left:0;right:0;top:calc(var(--offset-top) * -1);bottom:calc(var(--offset-bottom) * -1);padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:calc(var(--padding-top) + var(--offset-top));padding-bottom:calc(var(--padding-bottom) + var(--keyboard-offset) + var(--offset-bottom));position:absolute;background:var(--background);color:var(--color);-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.inner-scroll{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.scroll-x,.scroll-y{-webkit-overflow-scrolling:touch;will-change:scroll-position;-ms-scroll-chaining:none;overscroll-behavior:contain}.scroll-y{-ms-touch-action:pan-y;touch-action:pan-y;overflow-y:var(--overflow)}.scroll-x{-ms-touch-action:pan-x;touch-action:pan-x;overflow-x:var(--overflow)}.scroll-x.scroll-y{-ms-touch-action:auto;touch-action:auto}.overscroll:after,.overscroll:before{position:absolute;width:1px;height:1px;content:\"\"}.overscroll:before{bottom:-1px}.overscroll:after{top:-1px}:host(.content-sizing){contain:none}:host(.content-sizing) .inner-scroll{position:relative}.transition-effect{left:-100%;opacity:0;pointer-events:none}.transition-cover,.transition-effect{position:absolute;width:100%;height:100%}.transition-cover{right:0;background:#000;opacity:.1}.transition-shadow{display:block;position:absolute;right:0;width:10px;height:100%;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTE3MDgzRkQ5QTkyMTFFOUEwNzQ5MkJFREE1NUY2MjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTE3MDgzRkU5QTkyMTFFOUEwNzQ5MkJFREE1NUY2MjQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMTcwODNGQjlBOTIxMUU5QTA3NDkyQkVEQTU1RjYyNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMTcwODNGQzlBOTIxMUU5QTA3NDkyQkVEQTU1RjYyNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmePEuQAAABNSURBVHjaYvz//z8DIxAwMDAwATGMhmFmPDQuOSZks0AMmoJBaQHjkPfB0Lfg/2gQjVow+HPy/yHvg9GiYjQfjMbBqAWjFgy/4hogwADYqwdzxy5BuwAAAABJRU5ErkJggg==);background-repeat:repeat-y;background-size:10px 16px}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
var getParentElement = function (el) {
    if (el.parentElement) {
        // normal element with a parent element
        return el.parentElement;
    }
    if (el.parentNode && el.parentNode.host) {
        // shadow dom's document fragment
        return el.parentNode.host;
    }
    return null;
};
var getPageElement = function (el) {
    var tabs = el.closest('ion-tabs');
    if (tabs) {
        return tabs;
    }
    var page = el.closest('ion-app,ion-page,.ion-page,page-inner');
    if (page) {
        return page;
    }
    return getParentElement(el);
};
// ******** DOM READ ****************
var updateScrollDetail = function (detail, el, timestamp, shouldStart) {
    var prevX = detail.currentX;
    var prevY = detail.currentY;
    var prevT = detail.timeStamp;
    var currentX = el.scrollLeft;
    var currentY = el.scrollTop;
    var timeDelta = timestamp - prevT;
    if (shouldStart) {
        // remember the start positions
        detail.startTimeStamp = timestamp;
        detail.startX = currentX;
        detail.startY = currentY;
        detail.velocityX = detail.velocityY = 0;
    }
    detail.timeStamp = timestamp;
    detail.currentX = detail.scrollLeft = currentX;
    detail.currentY = detail.scrollTop = currentY;
    detail.deltaX = currentX - detail.startX;
    detail.deltaY = currentY - detail.startY;
    if (timeDelta > 0 && timeDelta < 100) {
        var velocityX = (currentX - prevX) / timeDelta;
        var velocityY = (currentY - prevY) / timeDelta;
        detail.velocityX = velocityX * 0.7 + detail.velocityX * 0.3;
        detail.velocityY = velocityY * 0.7 + detail.velocityY * 0.3;
    }
};
export { Content as ion_content };
