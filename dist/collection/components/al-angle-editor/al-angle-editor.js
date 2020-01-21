import { h } from "@stencil/core";
import MinusIcon from "../../assets/svg/minus.svg";
import TickIcon from "../../assets/svg/tick.svg";
import i18n from "./al-angle-editor.i18n.en.json";
export class AlAngleEditor {
    constructor() {
        this._contentStrings = i18n;
    }
    render() {
        if (this.angle) {
            const [angleId, angle] = this.angle;
            return (h("form", { onSubmit: e => e.preventDefault() },
                h("ion-item", null,
                    h("ion-input", { id: "title", value: angle.title, placeholder: this._contentStrings.title, required: true, onIonChange: e => (angle.title = e.detail.value), maxlength: 20 })),
                h("ion-item", null,
                    h("ion-textarea", { id: "description", value: angle.description, placeholder: this._contentStrings.description, rows: 5, onIonChange: e => (angle.description = e.detail.value), maxlength: 280 })),
                h("ion-item", null,
                    h("ion-button", { size: "small", onClick: () => {
                            this.deleteAngle.emit(angleId);
                            this.angle = null;
                        } },
                        h("ion-icon", { src: MinusIcon }),
                        "\u00A0",
                        this._contentStrings.delete),
                    h("ion-button", { size: "small", type: "submit", onClick: () => {
                            if (angle.title) {
                                this.saveAngle.emit([angleId, angle]);
                            }
                        } },
                        h("ion-icon", { src: TickIcon }),
                        "\u00A0",
                        this._contentStrings.update))));
        }
        return null;
    }
    static get is() { return "al-angle-editor"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["al-angle-editor.css"]
    }; }
    static get styleUrls() { return {
        "$": ["al-angle-editor.css"]
    }; }
    static get properties() { return {
        "angle": {
            "type": "unknown",
            "mutable": true,
            "complexType": {
                "original": "[string, AlAngle]",
                "resolved": "[string, AlAngle]",
                "references": {
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
            }
        }
    }; }
    static get events() { return [{
            "method": "deleteAngle",
            "name": "deleteAngle",
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
            "method": "saveAngle",
            "name": "saveAngle",
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
