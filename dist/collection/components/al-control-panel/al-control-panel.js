import { h } from "@stencil/core";
import ConsoleIcon from "../../assets/svg/console-2.svg";
import GraphIcon from "../../assets/svg/graph.svg";
import SettingsIcon from "../../assets/svg/options.svg";
import SourceIcon from "../../assets/svg/source.svg";
import { Scroll } from "../../functional-components/Scroll";
import i18n from "./al-control-panel.i18n.en.json";
export class AlSettings {
    constructor() {
        this._contentStrings = i18n;
        this.angles = null;
        this.consoleTabEnabled = true;
        this.edges = null;
        this.graphTabEnabled = true;
        this.nodes = null;
        this.selected = null;
        this.settingsTabEnabled = true;
        this.srcTabEnabled = true;
        this.tabContentHeight = null;
        this.url = null;
        this.urls = null;
    }
    _getGraphJson() {
        if (this.nodes && this.edges && this.angles) {
            const graph = {
                nodes: Array.from(this.nodes),
                edges: Array.from(this.edges),
                angles: Array.from(this.angles)
            };
            return JSON.stringify(graph);
        }
        return "";
    }
    render() {
        const tabContentHeight = this.tabContentHeight || this.el.parentElement.clientHeight + "px";
        const numTabsEnabled = [
            this.consoleTabEnabled,
            this.graphTabEnabled,
            this.settingsTabEnabled,
            this.srcTabEnabled
        ].filter(Boolean).length;
        return (h("ion-app", null,
            h("al-tabs", null,
                numTabsEnabled > 1 ? (h("ion-tab-bar", null,
                    this.srcTabEnabled ? (h("ion-tab-button", { tab: "src" },
                        h("ion-icon", { src: SourceIcon }),
                        h("ion-label", null, this._contentStrings.src))) : null,
                    this.settingsTabEnabled ? (h("ion-tab-button", { tab: "settings" },
                        h("ion-icon", { src: SettingsIcon }),
                        h("ion-label", null, this._contentStrings.settings))) : null,
                    this.graphTabEnabled ? (h("ion-tab-button", { tab: "graph" },
                        h("ion-icon", { src: GraphIcon }),
                        h("ion-label", null, this._contentStrings.graph))) : null,
                    this.consoleTabEnabled ? (h("ion-tab-button", { tab: "console" },
                        h("ion-icon", { src: ConsoleIcon }),
                        h("ion-label", null, this._contentStrings.console))) : null)) : null,
                this.srcTabEnabled ? (h("ion-tab", { tab: "src" },
                    h("al-url-picker", { urls: this.urls, url: this.url }))) : null,
                this.settingsTabEnabled ? (h("ion-tab", { tab: "settings" },
                    h(Scroll, { height: tabContentHeight },
                        h("al-settings", { "bounding-box-enabled": this.boundingBoxEnabled, "controls-type": this.controlsType, "display-mode": this.displayMode, "graph-enabled": this.graphEnabled, "graph-visible": this.graphTabEnabled, orientation: this.orientation, "slices-index": this.slicesIndex, "slices-max-index": this.slicesMaxIndex, "slices-brightness": this.slicesBrightness, "slices-contrast": this.slicesContrast, "volume-brightness": this.volumeBrightness, "volume-contrast": this.volumeContrast, "volume-steps": this.volumeSteps, "volume-steps-high-enabled": this.volumeStepsHighEnabled, units: this.units })))) : null,
                this.graphTabEnabled ? (h("ion-tab", { tab: "graph" },
                    h(Scroll, { height: tabContentHeight },
                        h("al-graph-editor", { selected: this.selected, nodes: this.nodes, angles: this.angles, edges: this.edges })))) : null,
                this.consoleTabEnabled ? (h("ion-tab", { tab: "console" },
                    h(Scroll, { height: tabContentHeight },
                        h("al-console", { graph: this._getGraphJson() })))) : null)));
    }
    static get is() { return "al-control-panel"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["al-control-panel.css"]
    }; }
    static get styleUrls() { return {
        "$": ["al-control-panel.css"]
    }; }
    static get properties() { return {
        "angles": {
            "type": "unknown",
            "mutable": true,
            "complexType": {
                "original": "Map<string, AlAngle> | null",
                "resolved": "Map<string, AlAngle>",
                "references": {
                    "Map": {
                        "location": "global"
                    },
                    "AlAngle": {
                        "location": "import",
                        "path": "../../interfaces/index.js"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "defaultValue": "null"
        },
        "boundingBoxEnabled": {
            "type": "boolean",
            "mutable": true,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "bounding-box-enabled",
            "reflect": false
        },
        "consoleTabEnabled": {
            "type": "boolean",
            "mutable": true,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "console-tab-enabled",
            "reflect": false,
            "defaultValue": "true"
        },
        "controlsType": {
            "type": "string",
            "mutable": true,
            "complexType": {
                "original": "ControlsType",
                "resolved": "ControlsType.ORBIT | ControlsType.TRACKBALL",
                "references": {
                    "ControlsType": {
                        "location": "import",
                        "path": "../../enums/index.js"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "controls-type",
            "reflect": false
        },
        "displayMode": {
            "type": "string",
            "mutable": true,
            "complexType": {
                "original": "DisplayMode",
                "resolved": "DisplayMode.MESH | DisplayMode.SLICES | DisplayMode.VOLUME",
                "references": {
                    "DisplayMode": {
                        "location": "import",
                        "path": "../../enums/index.js"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "display-mode",
            "reflect": false
        },
        "edges": {
            "type": "unknown",
            "mutable": true,
            "complexType": {
                "original": "Map<string, AlEdge> | null",
                "resolved": "Map<string, AlEdge>",
                "references": {
                    "Map": {
                        "location": "global"
                    },
                    "AlEdge": {
                        "location": "import",
                        "path": "../../interfaces/index.js"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "defaultValue": "null"
        },
        "graphEnabled": {
            "type": "boolean",
            "mutable": true,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "graph-enabled",
            "reflect": false
        },
        "graphTabEnabled": {
            "type": "boolean",
            "mutable": true,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "graph-tab-enabled",
            "reflect": false,
            "defaultValue": "true"
        },
        "nodes": {
            "type": "unknown",
            "mutable": true,
            "complexType": {
                "original": "Map<string, AlNode> | null",
                "resolved": "Map<string, AlNode>",
                "references": {
                    "Map": {
                        "location": "global"
                    },
                    "AlNode": {
                        "location": "import",
                        "path": "../../interfaces/index.js"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "defaultValue": "null"
        },
        "orientation": {
            "type": "string",
            "mutable": true,
            "complexType": {
                "original": "Orientation",
                "resolved": "Orientation.AXIAL | Orientation.CORONAL | Orientation.SAGGITAL",
                "references": {
                    "Orientation": {
                        "location": "import",
                        "path": "../../enums/index.js"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "orientation",
            "reflect": false
        },
        "selected": {
            "type": "string",
            "mutable": true,
            "complexType": {
                "original": "string | null",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "selected",
            "reflect": false,
            "defaultValue": "null"
        },
        "settingsTabEnabled": {
            "type": "boolean",
            "mutable": true,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "settings-tab-enabled",
            "reflect": false,
            "defaultValue": "true"
        },
        "slicesBrightness": {
            "type": "number",
            "mutable": true,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "slices-brightness",
            "reflect": false
        },
        "slicesContrast": {
            "type": "number",
            "mutable": true,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "slices-contrast",
            "reflect": false
        },
        "slicesIndex": {
            "type": "number",
            "mutable": true,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "slices-index",
            "reflect": false
        },
        "slicesMaxIndex": {
            "type": "number",
            "mutable": true,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "slices-max-index",
            "reflect": false
        },
        "srcTabEnabled": {
            "type": "boolean",
            "mutable": true,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "src-tab-enabled",
            "reflect": false,
            "defaultValue": "true"
        },
        "tabContentHeight": {
            "type": "string",
            "mutable": true,
            "complexType": {
                "original": "string | null",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "tab-content-height",
            "reflect": false,
            "defaultValue": "null"
        },
        "units": {
            "type": "string",
            "mutable": true,
            "complexType": {
                "original": "Units",
                "resolved": "Units.METERS | Units.MILLIMETERS",
                "references": {
                    "Units": {
                        "location": "import",
                        "path": "../../enums/index.js"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "units",
            "reflect": false
        },
        "url": {
            "type": "string",
            "mutable": true,
            "complexType": {
                "original": "string | null",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "url",
            "reflect": false,
            "defaultValue": "null"
        },
        "urls": {
            "type": "unknown",
            "mutable": true,
            "complexType": {
                "original": "Map<string, string> | null",
                "resolved": "Map<string, string>",
                "references": {
                    "Map": {
                        "location": "global"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "defaultValue": "null"
        },
        "volumeBrightness": {
            "type": "number",
            "mutable": true,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "volume-brightness",
            "reflect": false
        },
        "volumeContrast": {
            "type": "number",
            "mutable": true,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "volume-contrast",
            "reflect": false
        },
        "volumeSteps": {
            "type": "number",
            "mutable": true,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "volume-steps",
            "reflect": false
        },
        "volumeStepsHighEnabled": {
            "type": "boolean",
            "mutable": true,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "volume-steps-high-enabled",
            "reflect": false
        }
    }; }
    static get elementRef() { return "el"; }
}
