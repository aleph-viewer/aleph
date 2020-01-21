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
import { r as registerInstance, f as getIonMode, c as createEvent, i as config, h, d as getElement } from './core-684c60cc.js';
import { a as attachComponent, d as detachComponent } from './framework-delegate-8aba239f.js';
import { g as getTimeGivenProgression, P as Point } from './cubic-bezier-287346e4.js';
import { t as transition } from './index-f1ea188f.js';
var RouterOutlet = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
        this.animationEnabled = true;
        /**
         * The mode determines which platform styles to use.
         */
        this.mode = getIonMode(this);
        /**
         * If `true`, the router-outlet should animate the transition of components.
         */
        this.animated = true;
        this.ionNavWillLoad = createEvent(this, "ionNavWillLoad", 7);
        this.ionNavWillChange = createEvent(this, "ionNavWillChange", 3);
        this.ionNavDidChange = createEvent(this, "ionNavDidChange", 3);
    }
    class_1.prototype.swipeHandlerChanged = function () {
        if (this.gesture) {
            this.gesture.setDisabled(this.swipeHandler === undefined);
        }
    };
    class_1.prototype.connectedCallback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, import('./swipe-back-5ccee2ef.js')];
                    case 1:
                        _a.gesture = (_b.sent()).createSwipeBackGesture(this.el, function () { return !!_this.swipeHandler && _this.swipeHandler.canStart() && _this.animationEnabled; }, function () { return _this.swipeHandler && _this.swipeHandler.onStart(); }, function (step) { return _this.ani && _this.ani.progressStep(step); }, function (shouldComplete, step, dur) {
                            if (_this.ani) {
                                _this.animationEnabled = false;
                                _this.ani.onFinish(function () {
                                    _this.animationEnabled = true;
                                    if (_this.swipeHandler) {
                                        _this.swipeHandler.onEnd(shouldComplete);
                                    }
                                }, { oneTimeCallback: true });
                                // Account for rounding errors in JS
                                var newStepValue = (shouldComplete) ? -0.001 : 0.001;
                                /**
                                 * Animation will be reversed here, so need to
                                 * reverse the easing curve as well
                                 *
                                 * Additionally, we need to account for the time relative
                                 * to the new easing curve, as `stepValue` is going to be given
                                 * in terms of a linear curve.
                                 */
                                if (!shouldComplete) {
                                    _this.ani.easing('cubic-bezier(1, 0, 0.68, 0.28)');
                                    newStepValue += getTimeGivenProgression(new Point(0, 0), new Point(1, 0), new Point(0.68, 0.28), new Point(1, 1), step);
                                }
                                else {
                                    newStepValue += getTimeGivenProgression(new Point(0, 0), new Point(0.32, 0.72), new Point(0, 1), new Point(1, 1), step);
                                }
                                _this.ani.progressEnd(shouldComplete ? 1 : 0, newStepValue, dur);
                            }
                        });
                        this.swipeHandlerChanged();
                        return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.componentWillLoad = function () {
        this.ionNavWillLoad.emit();
    };
    class_1.prototype.disconnectedCallback = function () {
        if (this.gesture) {
            this.gesture.destroy();
            this.gesture = undefined;
        }
    };
    /** @internal */
    class_1.prototype.commit = function (enteringEl, leavingEl, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var unlock, changed, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.lock()];
                    case 1:
                        unlock = _a.sent();
                        changed = false;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.transition(enteringEl, leavingEl, opts)];
                    case 3:
                        changed = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5:
                        unlock();
                        return [2 /*return*/, changed];
                }
            });
        });
    };
    /** @internal */
    class_1.prototype.setRouteId = function (id, params, direction) {
        return __awaiter(this, void 0, void 0, function () {
            var changed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setRoot(id, params, {
                            duration: direction === 'root' ? 0 : undefined,
                            direction: direction === 'back' ? 'back' : 'forward',
                        })];
                    case 1:
                        changed = _a.sent();
                        return [2 /*return*/, {
                                changed: changed,
                                element: this.activeEl
                            }];
                }
            });
        });
    };
    /** @internal */
    class_1.prototype.getRouteId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var active;
            return __generator(this, function (_a) {
                active = this.activeEl;
                return [2 /*return*/, active ? {
                        id: active.tagName,
                        element: active,
                    } : undefined];
            });
        });
    };
    class_1.prototype.setRoot = function (component, params, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var leavingEl, enteringEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.activeComponent === component) {
                            return [2 /*return*/, false];
                        }
                        leavingEl = this.activeEl;
                        return [4 /*yield*/, attachComponent(this.delegate, this.el, component, ['ion-page', 'ion-page-invisible'], params)];
                    case 1:
                        enteringEl = _a.sent();
                        this.activeComponent = component;
                        this.activeEl = enteringEl;
                        // commit animation
                        return [4 /*yield*/, this.commit(enteringEl, leavingEl, opts)];
                    case 2:
                        // commit animation
                        _a.sent();
                        return [4 /*yield*/, detachComponent(this.delegate, leavingEl)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    class_1.prototype.transition = function (enteringEl, leavingEl, opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, el, mode, animated, animationBuilder;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (leavingEl === enteringEl) {
                            return [2 /*return*/, false];
                        }
                        // emit nav will change event
                        this.ionNavWillChange.emit();
                        _a = this, el = _a.el, mode = _a.mode;
                        animated = this.animated && config.getBoolean('animated', true);
                        animationBuilder = this.animation || opts.animationBuilder || config.get('navAnimation');
                        return [4 /*yield*/, transition(Object.assign({ mode: mode,
                                animated: animated,
                                animationBuilder: animationBuilder,
                                enteringEl: enteringEl,
                                leavingEl: leavingEl, baseEl: el, progressCallback: (opts.progressAnimation
                                    ? function (ani) { return _this.ani = ani; }
                                    : undefined) }, opts))];
                    case 1:
                        _b.sent();
                        // emit nav changed event
                        this.ionNavDidChange.emit();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    class_1.prototype.lock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var p, resolve;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        p = this.waitPromise;
                        this.waitPromise = new Promise(function (r) { return resolve = r; });
                        if (!(p !== undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, p];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, resolve];
                }
            });
        });
    };
    class_1.prototype.render = function () {
        return (h("slot", null));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "watchers", {
        get: function () {
            return {
                "swipeHandler": ["swipeHandlerChanged"]
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "style", {
        get: function () { return ":host{left:0;right:0;top:0;bottom:0;position:absolute;contain:layout size style;overflow:hidden;z-index:0}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
export { RouterOutlet as ion_router_outlet };
