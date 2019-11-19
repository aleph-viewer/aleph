import { h } from "@stencil/core";
import i18n from "./al-node-list.i18n.en.json";
export class AlNodeList {
    constructor() {
        this._contentStrings = i18n;
        this.nodes = null;
        this.selected = null;
    }
    render() {
        if (this.nodes && this.nodes.size) {
            return (h("ion-list", null, Array.from(this.nodes).map(([nodeId, node]) => {
                return (h("ion-item", { selected: this.selected === nodeId ? true : false, onClick: () => this.selectedChanged.emit(nodeId) }, node.title));
            })));
        }
        return (h("ion-item", null,
            h("p", null, this._contentStrings.graphEmpty)));
    }
    static get is() { return "al-node-list"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["al-node-list.css"]
    }; }
    static get styleUrls() { return {
        "$": ["al-node-list.css"]
    }; }
    static get properties() { return {
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
                        "path": "../../interfaces"
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
        }
    }; }
    static get events() { return [{
            "method": "selectedChanged",
            "name": "selectedChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": ""
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }]; }
}
