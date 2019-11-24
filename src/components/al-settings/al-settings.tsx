import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import AlertIcon from "../../assets/svg/alert.svg";
import BoundingBoxIcon from "../../assets/svg/bounding-box-2.svg";
import ObjectIcon from "../../assets/svg/object-alone.svg";
import OrbitCameraIcon from "../../assets/svg/orbit_camera.svg";
import RecenterIcon from "../../assets/svg/recenter.svg";
import RotateObjectIcon from "../../assets/svg/rotate_object.svg";
import { ControlsType, Orientation, Units } from "../../enums";
import { DisplayMode } from "../../enums/DisplayMode";
import i18n from "./al-settings.i18n.en.json";
import { ContentStrings } from "./ContentStrings";

@Component({
  tag: "al-settings",
  styleUrl: "al-settings.css",
  shadow: true
})
export class AlSettings {
  private _contentStrings: ContentStrings = i18n;

  @Event() public boundingBoxEnabledChanged: EventEmitter;
  @Event() public controlsTypeChanged: EventEmitter;
  @Event() public displayModeChanged: EventEmitter;
  // @Event() public materialChanged: EventEmitter;
  @Event() public orientationChanged: EventEmitter;
  @Event() public recenter: EventEmitter;
  @Event() public slicesIndexChanged: EventEmitter;
  @Event() public slicesBrightnessChanged: EventEmitter;
  @Event() public slicesContrastChanged: EventEmitter;
  @Event() public unitsChanged: EventEmitter;
  @Event() public graphEnabledChanged: EventEmitter;
  @Event() public volumeBrightnessChanged: EventEmitter;
  @Event() public volumeContrastChanged: EventEmitter;
  @Event() public volumeStepsChanged: EventEmitter;
  @Event() public volumeStepsHighEnabledChanged: EventEmitter;

  @Prop({ mutable: true }) public boundingBoxEnabled: boolean;
  @Prop({ mutable: true }) public controlsType: ControlsType;
  @Prop({ mutable: true }) public displayMode: DisplayMode;
  @Prop({ mutable: true }) public graphEnabled: boolean;
  @Prop({ mutable: true }) public graphVisible: boolean;
  // @Prop({ mutable: true }) public material: Material = Material.DEFAULT;
  @Prop({ mutable: true }) public orientation: Orientation;
  @Prop({ mutable: true }) public slicesIndex: number;
  @Prop({ mutable: true }) public slicesMaxIndex: number;
  @Prop({ mutable: true }) public slicesBrightness: number; // window center
  @Prop({ mutable: true }) public slicesContrast: number; // window width
  @Prop({ mutable: true }) public units: Units;
  @Prop({ mutable: true }) public volumeBrightness: number; // window center
  @Prop({ mutable: true }) public volumeContrast: number; // window width
  @Prop({ mutable: true }) public volumeSteps: number;
  @Prop({ mutable: true }) public volumeStepsHighEnabled: boolean;

  private _boundingBoxEnabled(enabled: boolean) {
    this.boundingBoxEnabled = enabled;
    this.boundingBoxEnabledChanged.emit(enabled);
  }

  private _controlsType(controlsType: ControlsType) {
    this.controlsType = controlsType;
    this.controlsTypeChanged.emit(controlsType);
  }

  private _displayMode(displayMode: DisplayMode) {
    this.displayMode = displayMode;
    this.displayModeChanged.emit(displayMode);
  }

  private _graphEnabled(enabled: boolean) {
    this.graphEnabled = enabled;
    this.graphEnabledChanged.emit(enabled);
  }

  // private _material(material: Material) {
  //   this.material = material;
  //   this.materialChanged.emit(material);
  // }

  private _orientation(orientation: Orientation) {
    this.orientation = orientation;
    this.orientationChanged.emit(orientation);
  }

  private _slicesIndex(index: number) {
    this.slicesIndex = index;
    this.slicesIndexChanged.emit(index);
  }

  private _slicesBrightness(brightness: number) {
    this.slicesBrightness = brightness;
    this.slicesBrightnessChanged.emit(brightness);
  }

  private _slicesContrast(contrast: number) {
    this.slicesContrast = contrast;
    this.slicesContrastChanged.emit(contrast);
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

  private _units(units: Units) {
    this.units = units;
    this.unitsChanged.emit(this.units);
  }

  private _volumeBrightness(brightness: number) {
    this.volumeBrightness = brightness;
    this.volumeBrightnessChanged.emit(brightness);
  }

  private _volumeContrast(contrast: number) {
    this.volumeContrast = contrast;
    this.volumeContrastChanged.emit(contrast);
  }

  private _volumeSteps(steps: number) {
    steps = Math.round(steps * 10) / 10; // 1 decimal place.
    this.volumeSteps = steps;
    this.volumeStepsChanged.emit(steps);
  }

  private _volumeStepsHighEnabled(enabled: boolean) {
    if (enabled) {
      this._volumeSteps(this.volumeSteps + 0.2);
    } else {
      this._volumeSteps(this.volumeSteps - 0.2);
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
          "margin-top": "10px"
        }}
      >
        <ion-button
          style={{
            width: "80px"
          }}
          size="small"
          onClick={() => {
            this._switchControls();
          }}
        >
          <span
            style={{
              "font-size": "10px",
              color: "white"
            }}
            slot="start"
          >
            {cameraLabel}
          </span>
          <ion-icon
            style={{
              "min-width": "18px"
            }}
            slot="end"
            src={cameraIcon}
            title={cameraLabel}
          />
        </ion-button>

        <ion-button
          style={{
            width: "80px"
          }}
          size="small"
          onClick={() => {
            this.recenter.emit();
          }}
        >
          <span
            style={{
              "font-size": "10px",
              color: "white"
            }}
            slot="start"
          >
            {this._contentStrings.recenter}
          </span>
          <ion-icon
            style={{
              "min-width": "18px"
            }}
            slot="end"
            src={RecenterIcon}
            title={this._contentStrings.recenter}
          />
        </ion-button>

        <ion-button
          style={{
            width: "80px"
          }}
          size="small"
          onClick={() => {
            this._switchBoundingBoxEnabled();
          }}
        >
          <span
            style={{
              "font-size": "10px",
              color: "white"
            }}
            slot="start"
          >
            {this._contentStrings.bounds}
          </span>
          <ion-icon
            style={{
              "min-width": "18px"
            }}
            slot="end"
            src={boundingBoxEnabledIcon}
            title={this._contentStrings.bounds}
          />
        </ion-button>
      </div>
    );
  }

  public renderDisplayModeToggle() {
    if (this.displayMode !== DisplayMode.MESH) {
      return (
        <ion-item
          style={{
            display: "var(--display-mode-display, block)",
            "margin-top": "10px"
          }}
        >
          <span title={this._contentStrings.displayMode}>Mode</span>
          <select
            slot="end"
            onChange={e =>
              this._displayMode((e.srcElement as HTMLSelectElement)
                .value as DisplayMode)
            }
          >
            <option
              selected={this.displayMode === DisplayMode.SLICES}
              value={DisplayMode.SLICES}
            >
              {this._contentStrings.slices}
            </option>
            <option
              selected={this.displayMode === DisplayMode.VOLUME}
              value={DisplayMode.VOLUME}
            >
              {this._contentStrings.volume}
            </option>
          </select>
        </ion-item>
      );
    }

    return null;
  }

  public renderGraphEnabled() {
    if (this.graphVisible) {
      return (
        <div>
          <ion-list-header
            style={{
              color: "var(--al-item-color)",
              "border-width": "1px 0 0 0",
              "border-color": "var(--ion-list-header-border-color)",
              "border-style": "solid",
              "margin-top": "10px"
            }}
          >
            <span>Measure and Annotate</span>
          </ion-list-header>
          <ion-item
            style={{
              display: "var(--graph-enabled-display, block)"
            }}
          >
            <span title={this._contentStrings.graphEnabled}>
              {this._contentStrings.graphEnabled}
            </span>
            <ion-toggle
              slot="end"
              checked={this.graphEnabled}
              onIonChange={e => this._graphEnabled(e.detail.checked)}
            />
          </ion-item>
          <ion-item
            style={{
              display: "var(--units-display, block)"
            }}
          >
            <span title={this._contentStrings.units}>Units</span>
            <select
              slot="end"
              onChange={e =>
                this._units((e.srcElement as HTMLSelectElement).value as Units)
              }
            >
              <option
                selected={this.units === Units.MILLIMETERS}
                value={Units.MILLIMETERS}
              >
                {this._contentStrings.millimeters}
              </option>
              <option
                selected={this.units === Units.METERS}
                value={Units.METERS}
              >
                {this._contentStrings.meters}
              </option>
            </select>
          </ion-item>
        </div>
      );
    } else {
      return null;
    }
  }

  public renderHiResEnabled() {
    return (
      <ion-item
        style={{
          display: "var(--volume-steps-high-display, block)"
        }}
      >
        <span title={this._contentStrings.volumeStepsHighEnabledWarning}>
          {this._contentStrings.volumeStepsHighEnabled}{" "}
          <ion-icon src={AlertIcon} />
        </span>
        <ion-toggle
          slot="end"
          checked={this.volumeStepsHighEnabled}
          onIonChange={e => this._volumeStepsHighEnabled(e.detail.checked)}
        />
      </ion-item>
    );
  }

  public renderSlicesControls() {
    return (
      <div>
        <ion-item
          style={{
            display: "var(--slices-orientation-display, block)"
          }}
        >
          <span color="primary">Plane</span>
          <select
            slot="end"
            onChange={e =>
              this._orientation((e.srcElement as HTMLSelectElement)
                .value as Orientation)
            }
          >
            <option
              selected={this.orientation === Orientation.CORONAL}
              value={Orientation.CORONAL}
            >
              {this._contentStrings.coronal}
            </option>
            <option
              selected={this.orientation === Orientation.SAGGITAL}
              value={Orientation.SAGGITAL}
            >
              {this._contentStrings.saggital}
            </option>
            <option
              selected={this.orientation === Orientation.AXIAL}
              value={Orientation.AXIAL}
            >
              {this._contentStrings.axial}
            </option>
          </select>
        </ion-item>
        <ion-item
          style={{
            display: "var(--slices-index-display, block)"
          }}
        >
          <span>{this._contentStrings.slice}</span>
          <ion-range
            slot="end"
            min="0"
            max="1"
            step={1 / this.slicesMaxIndex}
            value={this.slicesIndex}
            onIonChange={e => this._slicesIndex(e.detail.value)}
          />
        </ion-item>
      </div>
    );
  }

  public renderSlicesWindowingControls() {
    return (
      <div>
        <ion-list-header
          style={{
            color: "var(--al-item-color)",
            "border-width": "1px 0 0 0",
            "border-color": "var(--ion-list-header-border-color)",
            "border-style": "solid",
            "margin-top": "10px"
          }}
        >
          <span>{this._contentStrings.windowingTitle}</span>
        </ion-list-header>
        <ion-item
          style={{
            display: "var(--slices-brightness-display, block)"
          }}
        >
          <span>{this._contentStrings.brightness}</span>
          <ion-range
            slot="end"
            min="0"
            max="1"
            step=".05"
            snaps="true"
            ticks="false"
            value={this.slicesBrightness}
            onIonChange={e => {
              this._slicesBrightness(e.detail.value);
            }}
          ></ion-range>
        </ion-item>
        <ion-item
          style={{
            display: "var(--slices-contrast-display, block)"
          }}
        >
          <span>{this._contentStrings.contrast}</span>
          <ion-range
            slot="end"
            min="0"
            max="1"
            step=".05"
            snaps="true"
            ticks="false"
            value={this.slicesContrast}
            onIonChange={e => this._slicesContrast(e.detail.value)}
          />
        </ion-item>
      </div>
    );
  }

  public renderVolumeWindowingControls() {
    return (
      <div>
        <ion-list-header
          style={{
            color: "var(--al-item-color)",
            "border-width": "1px 0 0 0",
            "border-color": "var(--ion-list-header-border-color)",
            "border-style": "solid",
            "margin-top": "10px"
          }}
        >
          <span>{this._contentStrings.windowingTitle}</span>
        </ion-list-header>
        <ion-item
          style={{
            display: "var(--volume-brightness-display, block)"
          }}
        >
          <span>{this._contentStrings.brightness}</span>
          <ion-range
            slot="end"
            min="0"
            max="1"
            step=".05"
            snaps="true"
            ticks="false"
            value={this.volumeBrightness}
            onIonChange={e => {
              this._volumeBrightness(e.detail.value);
            }}
          ></ion-range>
        </ion-item>
        <ion-item
          style={{
            display: "var(--volume-contrast-display, block)"
          }}
        >
          <span>{this._contentStrings.contrast}</span>
          <ion-range
            slot="end"
            min="0"
            max="1"
            step=".05"
            snaps="true"
            ticks="false"
            value={this.volumeContrast}
            onIonChange={e => this._volumeContrast(e.detail.value)}
          />
        </ion-item>
      </div>
    );
  }

  public renderOptions() {
    switch (this.displayMode) {
      case DisplayMode.SLICES: {
        return (
          <div>
            {this.renderSlicesControls()}
            {this.renderSlicesWindowingControls()}
          </div>
        );
      }
      case DisplayMode.VOLUME: {
        return (
          <div>
            {this.renderHiResEnabled()}
            {this.renderVolumeWindowingControls()}
          </div>
        );
      }
      default: {
        return;
      }
    }
  }

  public render() {
    return (
      <div
        style={{
          "max-width": "100%",
          "overflow-x": "hidden"
        }}
      >
        {this.renderControlsTypeSelect()}
        {this.renderDisplayModeToggle()}
        {this.renderOptions()}
        {this.renderGraphEnabled()}
      </div>
    );
  }
}
