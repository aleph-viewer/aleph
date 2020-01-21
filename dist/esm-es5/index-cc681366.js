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
var _this = this;
import { c as createAnimation } from './animation-d551500b.js';
/**
 * baseAnimation
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
var baseAnimation = function () {
    // https://material.io/guidelines/motion/movement.html#movement-movement-in-out-of-screen-bounds
    // https://material.io/guidelines/motion/duration-easing.html#duration-easing-natural-easing-curves
    // "Apply the sharp curve to items temporarily leaving the screen that may return
    // from the same exit point. When they return, use the deceleration curve. On mobile,
    // this transition typically occurs over 300ms" -- MD Motion Guide
    return createAnimation()
        .easing('cubic-bezier(0.0, 0.0, 0.2, 1)') // Deceleration curve (Entering the screen)
        .duration(300);
};
/**
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
var menuOverlayAnimation = function (menu) {
    var closedX;
    var openedX;
    var BOX_SHADOW_WIDTH = 8;
    var width = menu.width + BOX_SHADOW_WIDTH;
    var menuAnimation = createAnimation();
    var backdropAnimation = createAnimation();
    if (menu.isEndSide) {
        // right side
        closedX = width + 'px';
        openedX = '0px';
    }
    else {
        // left side
        closedX = -width + 'px';
        openedX = '0px';
    }
    menuAnimation
        .addElement(menu.menuInnerEl)
        .fromTo('transform', "translateX(" + closedX + ")", "translateX(" + openedX + ")");
    backdropAnimation
        .addElement(menu.backdropEl)
        .fromTo('opacity', 0.01, 0.32);
    return baseAnimation().addAnimation([menuAnimation, backdropAnimation]);
};
/**
 * Menu Push Type
 * The content slides over to reveal the menu underneath.
 * The menu itself also slides over to reveal its bad self.
 */
var menuPushAnimation = function (menu) {
    var contentOpenedX;
    var menuClosedX;
    var width = menu.width;
    if (menu.isEndSide) {
        contentOpenedX = -width + 'px';
        menuClosedX = width + 'px';
    }
    else {
        contentOpenedX = width + 'px';
        menuClosedX = -width + 'px';
    }
    var menuAnimation = createAnimation()
        .addElement(menu.menuInnerEl)
        .fromTo('transform', "translateX(" + menuClosedX + ")", 'translateX(0px)');
    var contentAnimation = createAnimation()
        .addElement(menu.contentEl)
        .fromTo('transform', 'translateX(0px)', "translateX(" + contentOpenedX + ")");
    var backdropAnimation = createAnimation()
        .addElement(menu.backdropEl)
        .fromTo('opacity', 0.01, 0.32);
    return baseAnimation().addAnimation([menuAnimation, backdropAnimation, contentAnimation]);
};
/**
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
var menuRevealAnimation = function (menu) {
    var openedX = (menu.width * (menu.isEndSide ? -1 : 1)) + 'px';
    var contentOpen = createAnimation()
        .addElement(menu.contentEl) // REVIEW
        .fromTo('transform', 'translateX(0px)', "translateX(" + openedX + ")");
    return baseAnimation().addAnimation(contentOpen);
};
var createMenuController = function () {
    var menuAnimations = new Map();
    var menus = [];
    var open = function (menu) { return __awaiter(_this, void 0, void 0, function () {
        var menuEl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(menu)];
                case 1:
                    menuEl = _a.sent();
                    if (menuEl) {
                        return [2 /*return*/, menuEl.open()];
                    }
                    return [2 /*return*/, false];
            }
        });
    }); };
    var close = function (menu) { return __awaiter(_this, void 0, void 0, function () {
        var menuEl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (menu !== undefined ? get(menu) : getOpen())];
                case 1:
                    menuEl = _a.sent();
                    if (menuEl !== undefined) {
                        return [2 /*return*/, menuEl.close()];
                    }
                    return [2 /*return*/, false];
            }
        });
    }); };
    var toggle = function (menu) { return __awaiter(_this, void 0, void 0, function () {
        var menuEl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(menu)];
                case 1:
                    menuEl = _a.sent();
                    if (menuEl) {
                        return [2 /*return*/, menuEl.toggle()];
                    }
                    return [2 /*return*/, false];
            }
        });
    }); };
    var enable = function (shouldEnable, menu) { return __awaiter(_this, void 0, void 0, function () {
        var menuEl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(menu)];
                case 1:
                    menuEl = _a.sent();
                    if (menuEl) {
                        menuEl.disabled = !shouldEnable;
                    }
                    return [2 /*return*/, menuEl];
            }
        });
    }); };
    var swipeGesture = function (shouldEnable, menu) { return __awaiter(_this, void 0, void 0, function () {
        var menuEl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(menu)];
                case 1:
                    menuEl = _a.sent();
                    if (menuEl) {
                        menuEl.swipeGesture = shouldEnable;
                    }
                    return [2 /*return*/, menuEl];
            }
        });
    }); };
    var isOpen = function (menu) { return __awaiter(_this, void 0, void 0, function () {
        var menuEl, menuEl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(menu != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, get(menu)];
                case 1:
                    menuEl = _a.sent();
                    return [2 /*return*/, (menuEl !== undefined && menuEl.isOpen())];
                case 2: return [4 /*yield*/, getOpen()];
                case 3:
                    menuEl = _a.sent();
                    return [2 /*return*/, menuEl !== undefined];
            }
        });
    }); };
    var isEnabled = function (menu) { return __awaiter(_this, void 0, void 0, function () {
        var menuEl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(menu)];
                case 1:
                    menuEl = _a.sent();
                    if (menuEl) {
                        return [2 /*return*/, !menuEl.disabled];
                    }
                    return [2 /*return*/, false];
            }
        });
    }); };
    var get = function (menu) { return __awaiter(_this, void 0, void 0, function () {
        var menuRef, menuEl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, waitUntilReady()];
                case 1:
                    _a.sent();
                    if (menu === 'start' || menu === 'end') {
                        menuRef = find(function (m) { return m.side === menu && !m.disabled; });
                        if (menuRef) {
                            return [2 /*return*/, menuRef];
                        }
                        // didn't find a menu side that is enabled
                        // so try to get the first menu side found
                        return [2 /*return*/, find(function (m) { return m.side === menu; })];
                    }
                    else if (menu != null) {
                        // the menuId was not left or right
                        // so try to get the menu by its "id"
                        return [2 /*return*/, find(function (m) { return m.menuId === menu; })];
                    }
                    menuEl = find(function (m) { return !m.disabled; });
                    if (menuEl) {
                        return [2 /*return*/, menuEl];
                    }
                    // get the first menu in the array, if one exists
                    return [2 /*return*/, menus.length > 0 ? menus[0].el : undefined];
            }
        });
    }); };
    /**
     * Get the instance of the opened menu. Returns `null` if a menu is not found.
     */
    var getOpen = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, waitUntilReady()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, _getOpenSync()];
            }
        });
    }); };
    /**
     * Get all menu instances.
     */
    var getMenus = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, waitUntilReady()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, getMenusSync()];
            }
        });
    }); };
    /**
     * Get whether or not a menu is animating. Returns `true` if any
     * menu is currently animating.
     */
    var isAnimating = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, waitUntilReady()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, isAnimatingSync()];
            }
        });
    }); };
    var registerAnimation = function (name, animation) {
        menuAnimations.set(name, animation);
    };
    var _register = function (menu) {
        if (menus.indexOf(menu) < 0) {
            if (!menu.disabled) {
                _setActiveMenu(menu);
            }
            menus.push(menu);
        }
    };
    var _unregister = function (menu) {
        var index = menus.indexOf(menu);
        if (index > -1) {
            menus.splice(index, 1);
        }
    };
    var _setActiveMenu = function (menu) {
        // if this menu should be enabled
        // then find all the other menus on this same side
        // and automatically disable other same side menus
        var side = menu.side;
        menus
            .filter(function (m) { return m.side === side && m !== menu; })
            .forEach(function (m) { return m.disabled = true; });
    };
    var _setOpen = function (menu, shouldOpen, animated) { return __awaiter(_this, void 0, void 0, function () {
        var openedMenu;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isAnimatingSync()) {
                        return [2 /*return*/, false];
                    }
                    if (!shouldOpen) return [3 /*break*/, 3];
                    return [4 /*yield*/, getOpen()];
                case 1:
                    openedMenu = _a.sent();
                    if (!(openedMenu && menu.el !== openedMenu)) return [3 /*break*/, 3];
                    return [4 /*yield*/, openedMenu.setOpen(false, false)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, menu._setOpen(shouldOpen, animated)];
            }
        });
    }); };
    var _createAnimation = function (type, menuCmp) {
        var animationBuilder = menuAnimations.get(type);
        if (!animationBuilder) {
            throw new Error('animation not registered');
        }
        var animation = animationBuilder(menuCmp);
        return animation;
    };
    var _getOpenSync = function () {
        return find(function (m) { return m._isOpen; });
    };
    var getMenusSync = function () {
        return menus.map(function (menu) { return menu.el; });
    };
    var isAnimatingSync = function () {
        return menus.some(function (menu) { return menu.isAnimating; });
    };
    var find = function (predicate) {
        var instance = menus.find(predicate);
        if (instance !== undefined) {
            return instance.el;
        }
        return undefined;
    };
    var waitUntilReady = function () {
        return Promise.all(Array.from(document.querySelectorAll('ion-menu'))
            .map(function (menu) { return menu.componentOnReady(); }));
    };
    registerAnimation('reveal', menuRevealAnimation);
    registerAnimation('push', menuPushAnimation);
    registerAnimation('overlay', menuOverlayAnimation);
    return {
        registerAnimation: registerAnimation,
        get: get,
        getMenus: getMenus,
        getOpen: getOpen,
        isEnabled: isEnabled,
        swipeGesture: swipeGesture,
        isAnimating: isAnimating,
        isOpen: isOpen,
        enable: enable,
        toggle: toggle,
        close: close,
        open: open,
        _getOpenSync: _getOpenSync,
        _createAnimation: _createAnimation,
        _register: _register,
        _unregister: _unregister,
        _setOpen: _setOpen,
        _setActiveMenu: _setActiveMenu,
    };
};
var menuController = /*@__PURE__*/ createMenuController();
export { menuController as m };
