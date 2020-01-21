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
import { r as registerInstance, c as createEvent, h, H as Host, d as getElement } from './core-684c60cc.js';
var Tabs = /** @class */ (function () {
    function class_1(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        this.transitioning = false;
        /** @internal */
        this.useRouter = false;
        this.onTabClicked = function (ev) {
            var _a = ev.detail, href = _a.href, tab = _a.tab;
            if (_this.useRouter && href !== undefined) {
                var router = document.querySelector('ion-router');
                if (router) {
                    router.push(href);
                }
            }
            else {
                _this.select(tab);
            }
        };
        this.ionNavWillLoad = createEvent(this, "ionNavWillLoad", 7);
        this.ionTabsWillChange = createEvent(this, "ionTabsWillChange", 3);
        this.ionTabsDidChange = createEvent(this, "ionTabsDidChange", 3);
    }
    class_1.prototype.componentWillLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.useRouter) {
                            this.useRouter = !!document.querySelector('ion-router') && !this.el.closest('[no-router]');
                        }
                        if (!!this.useRouter) return [3 /*break*/, 2];
                        tabs = this.tabs;
                        return [4 /*yield*/, this.select(tabs[0])];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.ionNavWillLoad.emit();
                        return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.componentWillRender = function () {
        var tabBar = this.el.querySelector('ion-tab-bar');
        if (tabBar) {
            var tab = this.selectedTab ? this.selectedTab.tab : undefined;
            tabBar.selectedTab = tab;
        }
    };
    /**
     * Select a tab by the value of its `tab` property or an element reference.
     *
     * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
     */
    class_1.prototype.select = function (tab) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedTab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedTab = getTab(this.tabs, tab);
                        if (!this.shouldSwitch(selectedTab)) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.setActive(selectedTab)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.notifyRouter()];
                    case 2:
                        _a.sent();
                        this.tabSwitch();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Get a specific tab by the value of its `tab` property or an element reference.
     *
     * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
     */
    class_1.prototype.getTab = function (tab) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getTab(this.tabs, tab)];
            });
        });
    };
    /**
     * Get the currently selected tab.
     */
    class_1.prototype.getSelected = function () {
        return Promise.resolve(this.selectedTab ? this.selectedTab.tab : undefined);
    };
    /** @internal */
    class_1.prototype.setRouteId = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedTab;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedTab = getTab(this.tabs, id);
                        if (!this.shouldSwitch(selectedTab)) {
                            return [2 /*return*/, { changed: false, element: this.selectedTab }];
                        }
                        return [4 /*yield*/, this.setActive(selectedTab)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                changed: true,
                                element: this.selectedTab,
                                markVisible: function () { return _this.tabSwitch(); },
                            }];
                }
            });
        });
    };
    /** @internal */
    class_1.prototype.getRouteId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabId;
            return __generator(this, function (_a) {
                tabId = this.selectedTab && this.selectedTab.tab;
                return [2 /*return*/, tabId !== undefined ? { id: tabId, element: this.selectedTab } : undefined];
            });
        });
    };
    class_1.prototype.setActive = function (selectedTab) {
        if (this.transitioning) {
            return Promise.reject('transitioning already happening');
        }
        this.transitioning = true;
        this.leavingTab = this.selectedTab;
        this.selectedTab = selectedTab;
        this.ionTabsWillChange.emit({ tab: selectedTab.tab });
        return selectedTab.setActive();
    };
    class_1.prototype.tabSwitch = function () {
        var selectedTab = this.selectedTab;
        var leavingTab = this.leavingTab;
        this.leavingTab = undefined;
        this.transitioning = false;
        if (!selectedTab) {
            return;
        }
        if (leavingTab !== selectedTab) {
            if (leavingTab) {
                leavingTab.active = false;
            }
            this.ionTabsDidChange.emit({ tab: selectedTab.tab });
        }
    };
    class_1.prototype.notifyRouter = function () {
        if (this.useRouter) {
            var router = document.querySelector('ion-router');
            if (router) {
                return router.navChanged('forward');
            }
        }
        return Promise.resolve(false);
    };
    class_1.prototype.shouldSwitch = function (selectedTab) {
        var leavingTab = this.selectedTab;
        return selectedTab !== undefined && selectedTab !== leavingTab && !this.transitioning;
    };
    Object.defineProperty(class_1.prototype, "tabs", {
        get: function () {
            return Array.from(this.el.querySelectorAll('ion-tab'));
        },
        enumerable: true,
        configurable: true
    });
    class_1.prototype.render = function () {
        return (h(Host, { onIonTabButtonClick: this.onTabClicked }, h("slot", { name: "top" }), h("div", { class: "tabs-inner" }, h("slot", null)), h("slot", { name: "bottom" })));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "style", {
        get: function () { return ":host{left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:column;flex-direction:column;width:100%;height:100%;z-index:0}.tabs-inner,:host{contain:layout size style}.tabs-inner{position:relative;-ms-flex:1;flex:1}"; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
var getTab = function (tabs, tab) {
    var tabEl = (typeof tab === 'string')
        ? tabs.find(function (t) { return t.tab === tab; })
        : tab;
    if (!tabEl) {
        console.error("tab with id: \"" + tabEl + "\" does not exist");
    }
    return tabEl;
};
export { Tabs as ion_tabs };
