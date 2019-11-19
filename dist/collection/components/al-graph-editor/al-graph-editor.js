import { h } from "@stencil/core";
export class AlGraphEditor {
    constructor() {
        this.nodes = null;
        this.angles = null;
        this.edges = null;
        this.selected = null;
    }
    _getSelectedNode() {
        if (this.selected && this.nodes) {
            const n = this.nodes.get(this.selected);
            if (n) {
                return [this.selected, n];
            }
        }
        return null;
    }
    _getSelectedEdge() {
        if (this.selected && this.edges) {
            const e = this.edges.get(this.selected);
            if (e) {
                return [this.selected, e];
            }
        }
        return null;
    }
    _getSelectedAngle() {
        if (this.selected && this.angles) {
            const a = this.angles.get(this.selected);
            if (a) {
                return [this.selected, a];
            }
        }
        return null;
    }
    render() {
        return [
            h("al-node-list", { nodes: this.nodes, selected: this.selected }),
            h("ion-item-divider", null),
            h("al-node-editor", { node: this._getSelectedNode() }),
            h("al-edge-editor", { edge: this._getSelectedEdge() }),
            h("al-angle-editor", { angle: this._getSelectedAngle() })
        ];
    }
    static get is() { return "al-graph-editor"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["al-graph-editor.css"]
    }; }
    static get styleUrls() { return {
        "$": ["al-graph-editor.css"]
    }; }
    static get properties() { return {
        "node": {
            "type": "unknown",
            "mutable": true,
            "complexType": {
                "original": "[string, AlNode]",
                "resolved": "[string, AlNode]",
                "references": {
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
            }
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
}
