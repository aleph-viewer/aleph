import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import BoundingBoxIcon from "../../assets/svg/bounding-box.svg";
import ObjectIcon from "../../assets/svg/object-alone.svg";
import OrbitCameraIcon from "../../assets/svg/orbit-camera.svg";
import RecenterIcon from "../../assets/svg/recenter.svg";
import RotateObjectIcon from "../../assets/svg/rotate-object.svg";
import { ControlsType } from "../../enums";
import i18n from "./al-view-controls.i18n.en.json";
import { ContentStrings } from "./ContentStrings";

@Component({
  tag: "al-view-controls",
  styleUrl: "al-view-controls.css",
  shadow: true
})
export class AlSettings {
  private _contentStrings: ContentStrings = i18n;

  @Event() public boundingBoxEnabledChanged: EventEmitter;
  @Event() public controlsTypeChanged: EventEmitter;
  @Event() public recenter: EventEmitter;

  @Prop({ mutable: true }) public boundingBoxEnabled: boolean;
  @Prop({ mutable: true }) public controlsType: ControlsType;

  private _boundingBoxEnabled(enabled: boolean) {
    this.boundingBoxEnabled = enabled;
    this.boundingBoxEnabledChanged.emit(enabled);
  }

  private _controlsType(controlsType: ControlsType) {
    this.controlsType = controlsType;
    this.controlsTypeChanged.emit(controlsType);
  }

  private _switchBoundingBoxEnabled() {
    if (this.boundingBoxEnabled) {
      this._boundingBoxEnabled(false);
    } else {
      this._boundingBoxEnabled(true);
    }
  }

  private _switchControls() {
    if (this.controlsType === ControlsType.ORBIT) {
      this._controlsType(ControlsType.TRACKBALL);
    } else if (this.controlsType === ControlsType.TRACKBALL) {
      this._controlsType(ControlsType.ORBIT);
    }
  }

  public renderControlsTypeSelect() {
    let cameraIcon: string;
    let cameraLabel: string;
    if (this.controlsType === ControlsType.ORBIT) {
      cameraIcon = OrbitCameraIcon;
      cameraLabel = this._contentStrings.orbit;
    } else if (this.controlsType === ControlsType.TRACKBALL) {
      cameraIcon = RotateObjectIcon;
      cameraLabel = this._contentStrings.rotate;
    }
    let boundingBoxEnabledIcon: string;
    if (this.boundingBoxEnabled) {
      boundingBoxEnabledIcon = BoundingBoxIcon;
    } else {
      boundingBoxEnabledIcon = ObjectIcon;
    }
    return (
      <div
        style={{
          "margin-top": "10px",
          "text-align": "center"
        }}
      >
        <ion-button
          style={{
            width: "28%",
            height: "45px",
            "margin-left": "5px",
            "margin-right": "5px"
          }}
          size="small"
          onClick={() => {
            this._switchControls();
          }}
        >
          <div
            style={{
              "font-size": "10px",
              color: "white",
              "margin-bottom": "2px"
            }}
          >
            <ion-icon
              style={{
                "min-width": "20px",
                "min-height": "20px",
                "margin-bottom": "2px"
              }}
              src={cameraIcon}
              title={cameraLabel}
            />
            <br />
            {cameraLabel}
          </div>
        </ion-button>

        <ion-button
          style={{
            width: "28%",
            height: "45px",
            "margin-left": "5px",
            "margin-right": "5px"
          }}
          size="small"
          onClick={() => {
            this.recenter.emit();
          }}
        >
          <div
            style={{
              "font-size": "10px",
              color: "white",
              "margin-bottom": "2px"
            }}
          >
            <ion-icon
              style={{
                "min-width": "20px",
                "min-height": "20px",
                "margin-bottom": "2px"
              }}
              src={RecenterIcon}
              title={this._contentStrings.recenter}
            />
            <br />
            {this._contentStrings.recenter}
          </div>
        </ion-button>

        <ion-button
          style={{
            width: "28%",
            height: "45px",
            "margin-left": "5px",
            "margin-right": "5px"
          }}
          size="small"
          onClick={() => {
            this._switchBoundingBoxEnabled();
          }}
        >
          <div
            style={{
              "font-size": "10px",
              color: "white",
              "margin-bottom": "2px"
            }}
          >
            <ion-icon
              style={{
                "min-width": "20px",
                "min-height": "20px",
                "margin-bottom": "2px"
              }}
              src={boundingBoxEnabledIcon}
              title={this._contentStrings.bounds}
            />
            <br />
            {this._contentStrings.bounds}
          </div>
        </ion-button>
      </div>
    );
  }

  public render() {
    return (
      <div
        style={{
          "max-width": "100%",
          "overflow-x": "hidden",
          "border-width": "0 0 1px 0",
          "border-color": "var(--ion-list-header-border-color)",
          "border-style": "solid",
          "padding-bottom": "10px",
          "margin-bottom": "10px"
        }}
      >
        {this.renderControlsTypeSelect()}
      </div>
    );
  }
}
