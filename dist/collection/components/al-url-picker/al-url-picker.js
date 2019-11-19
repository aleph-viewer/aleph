import { h } from "@stencil/core";
import RefreshIcon from "../../assets/svg/refresh.svg";
export class AlUrlPicker {
    constructor() {
        this.urls = null;
        this.url = null;
    }
    render() {
        if (this.urls) {
            return (h("form", { onSubmit: e => e.preventDefault() },
                h("ion-item", null,
                    h("ion-select", { id: "select", value: this.url, interface: "popover", placeholder: "", onIonChange: e => this.urlChanged.emit(e.detail.value) }, Array.from(this.urls).map(([url, title]) => {
                        return (h("ion-select-option", { value: url }, title));
                    }))),
                h("ion-item", null,
                    h("ion-input", { id: "input", type: "url", size: "100", placeholder: "src", required: true, value: this.url, ref: el => (this._input = el) })),
                h("ion-item", null,
                    h("ion-button", { id: "submit", size: "small", type: "submit", onClick: () => this.urlChanged.emit(this._input.value) },
                        h("ion-icon", { src: RefreshIcon }),
                        "\u00A0Load"))));
        }
        return null;
    }
    static get is() { return "al-url-picker"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["al-url-picker.css"]
    }; }
    static get styleUrls() { return {
        "$": ["al-url-picker.css"]
    }; }
    static get properties() { return {
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
        }
    }; }
    static get events() { return [{
            "method": "urlChanged",
            "name": "urlChanged",
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
