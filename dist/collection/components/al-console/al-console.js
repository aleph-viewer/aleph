import { h } from "@stencil/core";
import RunIcon from "../../assets/svg/run.svg";
import i18n from "./al-console.i18n.en.json";
export class AlConsole {
    constructor() {
        this._contentStrings = i18n;
        this.graph = null;
        this.tabSize = 2;
    }
    _getGraphJson() {
        let json = "";
        try {
            json = JSON.stringify(JSON.parse(this.graph), undefined, this.tabSize);
        }
        catch (_a) {
            // do nothing
        }
        return json;
    }
    render() {
        return (h("form", { onSubmit: e => e.preventDefault() },
            h("ion-item", null,
                h("ion-textarea", { id: "graph", value: this._getGraphJson(), rows: 10, required: true, onIonChange: e => (this.graph = e.detail.value), maxlength: 5000, ref: el => (this._graph = el) })),
            h("ion-item", null,
                h("ion-button", { size: "small", type: "submit", onClick: () => {
                        if (this.graph) {
                            this.graphSubmitted.emit(this._graph.value);
                        }
                    } },
                    h("ion-icon", { src: RunIcon }),
                    "\u00A0",
                    this._contentStrings.update))));
    }
    static get is() { return "al-console"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["al-console.css"]
    }; }
    static get styleUrls() { return {
        "$": ["al-console.css"]
    }; }
    static get properties() { return {
        "graph": {
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
            "attribute": "graph",
            "reflect": false,
            "defaultValue": "null"
        },
        "tabSize": {
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
            "attribute": "tab-size",
            "reflect": false,
            "defaultValue": "2"
        }
    }; }
    static get events() { return [{
            "method": "graphSubmitted",
            "name": "graphSubmitted",
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
