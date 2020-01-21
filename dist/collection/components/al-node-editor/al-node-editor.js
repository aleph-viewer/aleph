import { h } from "@stencil/core";
import MinusIcon from "../../assets/svg/minus.svg";
import TickIcon from "../../assets/svg/tick.svg";
import i18n from "./al-node-editor.i18n.en.json";
export class AlNodeEditor {
    constructor() {
        this._contentStrings = i18n;
    }
    render() {
        if (this.node) {
            const [nodeId, node] = this.node;
            return (h("form", { onSubmit: e => e.preventDefault() },
                h("ion-item", null,
                    h("ion-input", { id: "title", value: node.title, placeholder: this._contentStrings.title, required: true, onIonChange: e => (node.title = e.detail.value), maxlength: 20 })),
                h("ion-item", null,
                    h("ion-textarea", { id: "description", value: node.description, placeholder: this._contentStrings.description, rows: 5, onIonChange: e => (node.description = e.detail.value), maxlength: 280 })),
                h("ion-item", null,
                    h("ion-button", { size: "small", onClick: () => {
                            this.deleteNode.emit(nodeId);
                            this.node = null;
                        } },
                        h("ion-icon", { src: MinusIcon }),
                        "\u00A0",
                        this._contentStrings.delete),
                    h("ion-button", { size: "small", type: "submit", onClick: () => {
                            if (node.title) {
                                this.saveNode.emit([nodeId, node]);
                            }
                        } },
                        h("ion-icon", { src: TickIcon }),
                        "\u00A0",
                        this._contentStrings.update))));
        }
        return null;
    }
    static get is() { return "al-node-editor"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["al-node-editor.css"]
    }; }
    static get styleUrls() { return {
        "$": ["al-node-editor.css"]
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
        }
    }; }
    static get events() { return [{
            "method": "deleteNode",
            "name": "deleteNode",
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
            "method": "saveNode",
            "name": "saveNode",
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
