import { h, Host } from "@stencil/core";
/**
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot top - Content is placed at the top of the screen.
 * @slot bottom - Content is placed at the bottom of the screen.
 */
export class Tabs {
    constructor() {
        this.transitioning = false;
        this.onTabClicked = (ev) => {
            const { tab } = ev.detail;
            this.select(tab);
        };
    }
    async componentWillLoad() {
        const tabs = this.tabs;
        await this.select(tabs[0]);
        this.ionNavWillLoad.emit();
    }
    componentWillRender() {
        const tabBar = this.el.querySelector("ion-tab-bar");
        if (tabBar) {
            const tab = this.selectedTab ? this.selectedTab.tab : undefined;
            tabBar.selectedTab = tab;
        }
    }
    /**
     * Select a tab by the value of its `tab` property or an element reference.
     *
     * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
     */
    async select(tab) {
        const selectedTab = await this.getTab(tab);
        if (selectedTab) {
            if (!this.shouldSwitch(selectedTab)) {
                return false;
            }
            this.setActive(selectedTab);
            this.tabSwitch();
            return true;
        }
        return false;
    }
    /**
     * Get a specific tab by the value of its `tab` property or an element reference.
     *
     * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
     */
    async getTab(tab) {
        const tabEl = typeof tab === "string" ? this.tabs.find(t => t.tab === tab) : tab;
        return tabEl;
    }
    /**
     * Get the currently selected tab.
     */
    getSelected() {
        return Promise.resolve(this.selectedTab ? this.selectedTab.tab : undefined);
    }
    setActive(selectedTab) {
        if (this.transitioning) {
            return Promise.reject("transitioning already happening");
        }
        this.transitioning = true;
        this.leavingTab = this.selectedTab;
        this.selectedTab = selectedTab;
        this.ionTabsWillChange.emit({ tab: selectedTab.tab });
        try {
            selectedTab.setActive();
        }
        catch (e) {
            // do nothing
        }
        return true;
    }
    tabSwitch() {
        const selectedTab = this.selectedTab;
        const leavingTab = this.leavingTab;
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
    }
    shouldSwitch(selectedTab) {
        const leavingTab = this.selectedTab;
        return (selectedTab !== undefined &&
            selectedTab !== leavingTab &&
            !this.transitioning);
    }
    get tabs() {
        return Array.from(this.el.querySelectorAll("ion-tab"));
    }
    render() {
        return (h(Host, { onIonTabButtonClick: this.onTabClicked },
            h("slot", { name: "top" }),
            h("div", { class: "tabs-inner" },
                h("slot", null)),
            h("slot", { name: "bottom" })));
    }
    static get is() { return "al-tabs"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["al-tabs.css"]
    }; }
    static get styleUrls() { return {
        "$": ["al-tabs.css"]
    }; }
    static get states() { return {
        "selectedTab": {}
    }; }
    static get events() { return [{
            "method": "ionNavWillLoad",
            "name": "ionNavWillLoad",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [{
                        "text": undefined,
                        "name": "internal"
                    }],
                "text": "Emitted when the navigation will load a component."
            },
            "complexType": {
                "original": "void",
                "resolved": "void",
                "references": {}
            }
        }, {
            "method": "ionTabsWillChange",
            "name": "ionTabsWillChange",
            "bubbles": false,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": "Emitted when the navigation is about to transition to a new component."
            },
            "complexType": {
                "original": "{\n    tab: string;\n  }",
                "resolved": "{ tab: string; }",
                "references": {}
            }
        }, {
            "method": "ionTabsDidChange",
            "name": "ionTabsDidChange",
            "bubbles": false,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": "Emitted when the navigation has finished transitioning to a new component."
            },
            "complexType": {
                "original": "{\n    tab: string;\n  }",
                "resolved": "{ tab: string; }",
                "references": {}
            }
        }]; }
    static get methods() { return {
        "select": {
            "complexType": {
                "signature": "(tab: any) => Promise<boolean>",
                "parameters": [{
                        "tags": [{
                                "text": "tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.",
                                "name": "param"
                            }],
                        "text": "The tab instance to select. If passed a string, it should be the value of the tab's `tab` property."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonTabElement": {
                        "location": "global"
                    }
                },
                "return": "Promise<boolean>"
            },
            "docs": {
                "text": "Select a tab by the value of its `tab` property or an element reference.",
                "tags": [{
                        "name": "param",
                        "text": "tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property."
                    }]
            }
        },
        "getTab": {
            "complexType": {
                "signature": "(tab: any) => Promise<any>",
                "parameters": [{
                        "tags": [{
                                "text": "tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.",
                                "name": "param"
                            }],
                        "text": "The tab instance to select. If passed a string, it should be the value of the tab's `tab` property."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonTabElement": {
                        "location": "global"
                    }
                },
                "return": "Promise<any>"
            },
            "docs": {
                "text": "Get a specific tab by the value of its `tab` property or an element reference.",
                "tags": [{
                        "name": "param",
                        "text": "tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property."
                    }]
            }
        },
        "getSelected": {
            "complexType": {
                "signature": "() => Promise<string>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<string>"
            },
            "docs": {
                "text": "Get the currently selected tab.",
                "tags": []
            }
        }
    }; }
    static get elementRef() { return "el"; }
}
