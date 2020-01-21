import { h } from "@stencil/core";
import AlertIcon from "../../assets/svg/alert.svg";
import BoundingBoxIcon from "../../assets/svg/bounding-box-2.svg";
import ObjectIcon from "../../assets/svg/object-alone.svg";
import OrbitCameraIcon from "../../assets/svg/orbit_camera.svg";
import RecenterIcon from "../../assets/svg/recenter.svg";
import RotateObjectIcon from "../../assets/svg/rotate_object.svg";
import { ControlsType, Orientation, Units } from "../../enums";
import { DisplayMode } from "../../enums/DisplayMode";
import i18n from "./al-settings.i18n.en.json";
export class AlSettings {
    constructor() {
        this._contentStrings = i18n;
    }
    _boundingBoxEnabled(enabled) {
        this.boundingBoxEnabled = enabled;
        this.boundingBoxEnabledChanged.emit(enabled);
    }
    _controlsType(controlsType) {
        this.controlsType = controlsType;
        this.controlsTypeChanged.emit(controlsType);
    }
    _displayMode(displayMode) {
        this.displayMode = displayMode;
        this.displayModeChanged.emit(displayMode);
    }
    _graphEnabled(enabled) {
        this.graphEnabled = enabled;
        this.graphEnabledChanged.emit(enabled);
    }
    // private _material(material: Material) {
    //   this.material = material;
    //   this.materialChanged.emit(material);
    // }
    _orientation(orientation) {
        this.orientation = orientation;
        this.orientationChanged.emit(orientation);
    }
    _slicesIndex(index) {
        this.slicesIndex = index;
        this.slicesIndexChanged.emit(index);
    }
    _slicesBrightness(brightness) {
        this.slicesBrightness = brightness;
        this.slicesBrightnessChanged.emit(brightness);
    }
    _slicesContrast(contrast) {
        this.slicesContrast = contrast;
        this.slicesContrastChanged.emit(contrast);
    }
    _switchBoundingBoxEnabled() {
        if (this.boundingBoxEnabled) {
            this._boundingBoxEnabled(false);
        }
        else {
            this._boundingBoxEnabled(true);
        }
    }
    _switchControls() {
        if (this.controlsType === ControlsType.ORBIT) {
            this._controlsType(ControlsType.TRACKBALL);
        }
        else if (this.controlsType === ControlsType.TRACKBALL) {
            this._controlsType(ControlsType.ORBIT);
        }
    }
    _units(units) {
        this.units = units;
        this.unitsChanged.emit(this.units);
    }
    _volumeBrightness(brightness) {
        this.volumeBrightness = brightness;
        this.volumeBrightnessChanged.emit(brightness);
    }
    _volumeContrast(contrast) {
        this.volumeContrast = contrast;
        this.volumeContrastChanged.emit(contrast);
    }
    _volumeSteps(steps) {
        steps = Math.round(steps * 10) / 10; // 1 decimal place.
        this.volumeSteps = steps;
        this.volumeStepsChanged.emit(steps);
    }
    _volumeStepsHighEnabled(enabled) {
        if (enabled) {
            this._volumeSteps(this.volumeSteps + 0.2);
        }
        else {
            this._volumeSteps(this.volumeSteps - 0.2);
        }
    }
    renderControlsTypeSelect() {
        let cameraIcon;
        let cameraLabel;
        if (this.controlsType === ControlsType.ORBIT) {
            cameraIcon = OrbitCameraIcon;
            cameraLabel = this._contentStrings.orbit;
        }
        else if (this.controlsType === ControlsType.TRACKBALL) {
            cameraIcon = RotateObjectIcon;
            cameraLabel = this._contentStrings.rotate;
        }
        let boundingBoxEnabledIcon;
        if (this.boundingBoxEnabled) {
            boundingBoxEnabledIcon = BoundingBoxIcon;
        }
        else {
            boundingBoxEnabledIcon = ObjectIcon;
        }
        return (h("div", { style: {
                "margin-top": "10px",
                "text-align": "center"
            } },
            h("ion-button", { style: {
                    width: "28%",
                    height: "45px",
                    "margin-left": "5px",
                    "margin-right": "5px"
                }, size: "small", onClick: () => {
                    this._switchControls();
                } },
                h("div", { style: {
                        "font-size": "10px",
                        color: "white",
                        "margin-bottom": "2px"
                    } },
                    h("ion-icon", { style: {
                            "min-width": "20px",
                            "min-height": "20px",
                            "margin-bottom": "2px"
                        }, src: cameraIcon, title: cameraLabel }),
                    h("br", null),
                    cameraLabel)),
            h("ion-button", { style: {
                    width: "28%",
                    height: "45px",
                    "margin-left": "5px",
                    "margin-right": "5px"
                }, size: "small", onClick: () => {
                    this.recenter.emit();
                } },
                h("div", { style: {
                        "font-size": "10px",
                        color: "white",
                        "margin-bottom": "2px"
                    } },
                    h("ion-icon", { style: {
                            "min-width": "20px",
                            "min-height": "20px",
                            "margin-bottom": "2px"
                        }, src: RecenterIcon, title: this._contentStrings.recenter }),
                    h("br", null),
                    this._contentStrings.recenter)),
            h("ion-button", { style: {
                    width: "28%",
                    height: "45px",
                    "margin-left": "5px",
                    "margin-right": "5px"
                }, size: "small", onClick: () => {
                    this._switchBoundingBoxEnabled();
                } },
                h("div", { style: {
                        "font-size": "10px",
                        color: "white",
                        "margin-bottom": "2px"
                    } },
                    h("ion-icon", { style: {
                            "min-width": "20px",
                            "min-height": "20px",
                            "margin-bottom": "2px"
                        }, src: boundingBoxEnabledIcon, title: this._contentStrings.bounds }),
                    h("br", null),
                    this._contentStrings.bounds))));
    }
    renderDisplayModeToggle() {
        if (this.displayMode !== DisplayMode.MESH) {
            return (h("ion-item", { style: {
                    display: "var(--display-mode-display, block)",
                    "margin-top": "10px"
                } },
                h("span", { title: this._contentStrings.displayMode }, "Mode"),
                h("select", { slot: "end", onChange: e => this._displayMode(e.srcElement
                        .value) },
                    h("option", { selected: this.displayMode === DisplayMode.SLICES, value: DisplayMode.SLICES }, this._contentStrings.slices),
                    h("option", { selected: this.displayMode === DisplayMode.VOLUME, value: DisplayMode.VOLUME }, this._contentStrings.volume))));
        }
        return null;
    }
    renderGraphEnabled() {
        if (this.graphVisible) {
            return (h("div", null,
                h("ion-list-header", { style: {
                        color: "var(--al-item-color)",
                        "border-width": "1px 0 0 0",
                        "border-color": "var(--ion-list-header-border-color)",
                        "border-style": "solid",
                        "margin-top": "10px"
                    } },
                    h("span", null, "Measure and Annotate")),
                h("ion-item", { style: {
                        display: "var(--graph-enabled-display, block)"
                    } },
                    h("span", { title: this._contentStrings.graphEnabled }, this._contentStrings.graphEnabled),
                    h("ion-toggle", { slot: "end", checked: this.graphEnabled, onIonChange: e => this._graphEnabled(e.detail.checked) })),
                h("ion-item", { style: {
                        display: "var(--units-display, block)"
                    } },
                    h("span", { title: this._contentStrings.units }, "Units"),
                    h("select", { slot: "end", onChange: e => this._units(e.srcElement.value) },
                        h("option", { selected: this.units === Units.MILLIMETERS, value: Units.MILLIMETERS }, this._contentStrings.millimeters),
                        h("option", { selected: this.units === Units.METERS, value: Units.METERS }, this._contentStrings.meters)))));
        }
        else {
            return null;
        }
    }
    renderHiResEnabled() {
        return (h("ion-item", { style: {
                display: "var(--volume-steps-high-display, block)"
            } },
            h("span", { title: this._contentStrings.volumeStepsHighEnabledWarning },
                this._contentStrings.volumeStepsHighEnabled,
                " ",
                h("ion-icon", { src: AlertIcon })),
            h("ion-toggle", { slot: "end", checked: this.volumeStepsHighEnabled, onIonChange: e => this._volumeStepsHighEnabled(e.detail.checked) })));
    }
    renderSlicesControls() {
        return (h("div", null,
            h("ion-item", { style: {
                    display: "var(--slices-orientation-display, block)"
                } },
                h("span", { color: "primary" }, "Plane"),
                h("select", { slot: "end", onChange: e => this._orientation(e.srcElement
                        .value) },
                    h("option", { selected: this.orientation === Orientation.CORONAL, value: Orientation.CORONAL }, this._contentStrings.coronal),
                    h("option", { selected: this.orientation === Orientation.SAGGITAL, value: Orientation.SAGGITAL }, this._contentStrings.saggital),
                    h("option", { selected: this.orientation === Orientation.AXIAL, value: Orientation.AXIAL }, this._contentStrings.axial))),
            h("ion-item", { style: {
                    display: "var(--slices-index-display, block)"
                } },
                h("span", null, this._contentStrings.slice),
                h("ion-range", { slot: "end", min: 0, max: 1, step: 1 / this.slicesMaxIndex, value: this.slicesIndex, onIonChange: e => this._slicesIndex(e.detail.value) }))));
    }
    renderSlicesWindowingControls() {
        return (h("div", null,
            h("ion-list-header", { style: {
                    color: "var(--al-item-color)",
                    "border-width": "1px 0 0 0",
                    "border-color": "var(--ion-list-header-border-color)",
                    "border-style": "solid",
                    "margin-top": "10px"
                } },
                h("span", null, this._contentStrings.windowingTitle)),
            h("ion-item", { style: {
                    display: "var(--slices-brightness-display, block)"
                } },
                h("span", null, this._contentStrings.brightness),
                h("ion-range", { slot: "end", min: 0, max: 1, step: 0.05, snaps: true, ticks: false, value: this.slicesBrightness, onIonChange: e => {
                        this._slicesBrightness(e.detail.value);
                    } })),
            h("ion-item", { style: {
                    display: "var(--slices-contrast-display, block)"
                } },
                h("span", null, this._contentStrings.contrast),
                h("ion-range", { slot: "end", min: 0, max: 1, step: 0.05, snaps: true, ticks: false, value: this.slicesContrast, onIonChange: e => this._slicesContrast(e.detail.value) }))));
    }
    renderVolumeWindowingControls() {
        return (h("div", null,
            h("ion-list-header", { style: {
                    color: "var(--al-item-color)",
                    "border-width": "1px 0 0 0",
                    "border-color": "var(--ion-list-header-border-color)",
                    "border-style": "solid",
                    "margin-top": "10px"
                } },
                h("span", null, this._contentStrings.windowingTitle)),
            h("ion-item", { style: {
                    display: "var(--volume-brightness-display, block)"
                } },
                h("span", null, this._contentStrings.brightness),
                h("ion-range", { slot: "end", min: 0, max: 1, step: 0.05, snaps: true, ticks: false, value: this.volumeBrightness, onIonChange: e => {
                        this._volumeBrightness(e.detail.value);
                    } })),
            h("ion-item", { style: {
                    display: "var(--volume-contrast-display, block)"
                } },
                h("span", null, this._contentStrings.contrast),
                h("ion-range", { slot: "end", min: 0, max: 1, step: 0.05, snaps: true, ticks: false, value: this.volumeContrast, onIonChange: e => this._volumeContrast(e.detail.value) }))));
    }
    renderOptions() {
        switch (this.displayMode) {
            case DisplayMode.SLICES: {
                return (h("div", null,
                    this.renderSlicesControls(),
                    this.renderSlicesWindowingControls()));
            }
            case DisplayMode.VOLUME: {
                return (h("div", null,
                    this.renderHiResEnabled(),
                    this.renderVolumeWindowingControls()));
            }
            default: {
                return;
            }
        }
    }
    render() {
        return (h("div", { style: {
                "max-width": "100%",
                "overflow-x": "hidden"
            } },
            this.renderControlsTypeSelect(),
            this.renderDisplayModeToggle(),
            this.renderOptions(),
            this.renderGraphEnabled()));
    }
    static get is() { return "al-settings"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["al-settings.css"]
    }; }
    static get styleUrls() { return {
        "$": ["al-settings.css"]
    }; }
    static get properties() { return {
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
        "controlsType": {
            "type": "string",
            "mutable": true,
            "complexType": {
                "original": "ControlsType",
                "resolved": "ControlsType.ORBIT | ControlsType.TRACKBALL",
                "references": {
                    "ControlsType": {
                        "location": "import",
                        "path": "../../enums"
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
                        "path": "../../enums/DisplayMode"
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
        "graphVisible": {
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
            "attribute": "graph-visible",
            "reflect": false
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
                        "path": "../../enums"
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
        "units": {
            "type": "string",
            "mutable": true,
            "complexType": {
                "original": "Units",
                "resolved": "Units.METERS | Units.MILLIMETERS",
                "references": {
                    "Units": {
                        "location": "import",
                        "path": "../../enums"
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
    static get events() { return [{
            "method": "boundingBoxEnabledChanged",
            "name": "boundingBoxEnabledChanged",
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
            "method": "controlsTypeChanged",
            "name": "controlsTypeChanged",
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
            "method": "displayModeChanged",
            "name": "displayModeChanged",
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
            "method": "orientationChanged",
            "name": "orientationChanged",
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
            "method": "recenter",
            "name": "recenter",
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
            "method": "slicesIndexChanged",
            "name": "slicesIndexChanged",
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
            "method": "slicesBrightnessChanged",
            "name": "slicesBrightnessChanged",
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
            "method": "slicesContrastChanged",
            "name": "slicesContrastChanged",
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
            "method": "unitsChanged",
            "name": "unitsChanged",
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
            "method": "graphEnabledChanged",
            "name": "graphEnabledChanged",
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
            "method": "volumeBrightnessChanged",
            "name": "volumeBrightnessChanged",
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
            "method": "volumeContrastChanged",
            "name": "volumeContrastChanged",
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
            "method": "volumeStepsChanged",
            "name": "volumeStepsChanged",
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
            "method": "volumeStepsHighEnabledChanged",
            "name": "volumeStepsHighEnabledChanged",
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
