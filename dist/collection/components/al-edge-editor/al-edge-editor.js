import { h } from "@stencil/core";
import MinusIcon from "../../assets/svg/minus.svg";
import TickIcon from "../../assets/svg/tick.svg";
import i18n from "./al-edge-editor.i18n.en.json";
export class AlEdgeEditor {
    constructor() {
        this._contentStrings = i18n;
    }
    render() {
        if (this.edge) {
            const [edgeId, edge] = this.edge;
            return (h("form", { onSubmit: e => e.preventDefault() },
                h("ion-item", null,
                    h("ion-input", { id: "title", value: edge.title, placeholder: this._contentStrings.title, required: true, onIonChange: e => (edge.title = e.detail.value), maxlength: 20 })),
                h("ion-item", null,
                    h("ion-textarea", { id: "description", value: edge.description, placeholder: this._contentStrings.description, rows: 5, onIonChange: e => (edge.description = e.detail.value), maxlength: 280 })),
                h("ion-item", null,
                    h("ion-button", { size: "small", onClick: () => {
                            this.deleteEdge.emit(edgeId);
                            this.edge = null;
                        } },
                        h("ion-icon", { src: MinusIcon }),
                        "\u00A0",
                        this._contentStrings.delete),
                    h("ion-button", { size: "small", type: "submit", onClick: () => {
                            if (edge.title) {
                                this.saveEdge.emit([edgeId, edge]);
                            }
                        } },
                        h("ion-icon", { src: TickIcon }),
                        "\u00A0",
                        this._contentStrings.update))));
        }
        return null;
    }
    static get is() { return "al-edge-editor"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["al-edge-editor.css"]
    }; }
    static get styleUrls() { return {
        "$": ["al-edge-editor.css"]
    }; }
    static get properties() { return {
        "edge": {
            "type": "unknown",
            "mutable": true,
            "complexType": {
                "original": "[string, AlEdge]",
                "resolved": "[string, AlEdge]",
                "references": {
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
            }
        }
    }; }
    static get events() { return [{
            "method": "deleteEdge",
            "name": "deleteEdge",
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
        }, {
            "method": "saveEdge",
            "name": "saveEdge",
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
