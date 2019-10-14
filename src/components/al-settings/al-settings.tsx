import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import BoundingBoxIcon from "../../assets/svg/bounding-box.svg";
import BrightnessIcon from "../../assets/svg/brightness.svg";
import ContrastIcon from "../../assets/svg/contrast.svg";
import ControlsTypeIcon from "../../assets/svg/controls-type.svg";
import DisplayModeIcon from "../../assets/svg/display-mode.svg";
import GraphIcon from "../../assets/svg/graph.svg";
// import MaterialIcon from "../../assets/svg/material.svg";
import OrientationIcon from "../../assets/svg/orientation.svg";
import RecenterIcon from "../../assets/svg/recenter.svg";
import SliderIcon from "../../assets/svg/slider.svg";
import UnitsIcon from "../../assets/svg/units.svg";
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

  private _units(units: Units) {
    this.units = units;
    this.unitsChanged.emit(units);
  }

  private _volumeSteps(steps: number) {
    steps = Math.round(steps * 10) / 10; // 1 decimal place.
    this.volumeSteps = steps;
    this.volumeStepsChanged.emit(steps);
  }

  private _volumeBrightness(brightness: number) {
    this.volumeBrightness = brightness;
    this.volumeBrightnessChanged.emit(brightness);
  }

  private _volumeContrast(contrast: number) {
    this.volumeContrast = contrast;
    this.volumeContrastChanged.emit(contrast);
  }

  public renderDisplayModeToggle() {
    if (this.displayMode !== DisplayMode.MESH) {
      return (
        <ion-item
          style={{
            display: "var(--display-mode-display, block)"
          }}
        >
          <ion-icon
            src={DisplayModeIcon}
            slot="start"
            title={this._contentStrings.displayMode}
          />
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
        <ion-item
          style={{
            display: "var(--graph-enabled-display, block)"
          }}
        >
          <ion-icon
            src={GraphIcon}
            slot="start"
            title={this._contentStrings.graphEnabled}
          />
          <ion-toggle
            slot="end"
            checked={this.graphEnabled}
            onIonChange={e => this._graphEnabled(e.detail.checked)}
          />
        </ion-item>
      );
    } else {
      return null;
    }
  }

  public renderBoundingBoxEnabled() {
    return (
      <ion-item
        style={{
          display: "var(--bounding-box-enabled-display, block)"
        }}
      >
        <ion-icon
          src={BoundingBoxIcon}
          slot="start"
          title={this._contentStrings.boundingBoxEnabled}
        />
        <ion-toggle
          slot="end"
          checked={this.boundingBoxEnabled}
          onIonChange={e => this._boundingBoxEnabled(e.detail.checked)}
        />
      </ion-item>
    );
  }

  public renderControlsTypeSelect() {
    return (
      <ion-item
        style={{
          display: "var(--controls-type-display, block)"
        }}
      >
        <ion-icon
          src={ControlsTypeIcon}
          slot="start"
          title={this._contentStrings.controlsType}
        />
        <select
          slot="end"
          onChange={e =>
            this._controlsType((e.srcElement as HTMLSelectElement)
              .value as ControlsType)
          }
        >
          <option
            selected={this.controlsType === ControlsType.ORBIT}
            value={ControlsType.ORBIT}
          >
            {this._contentStrings.orbit}
          </option>
          <option
            selected={this.controlsType === ControlsType.TRACKBALL}
            value={ControlsType.TRACKBALL}
          >
            {this._contentStrings.trackball}
          </option>
        </select>
      </ion-item>
    );
  }

  public renderRecenterButton() {
    return (
      <ion-item
        style={{
          display: "var(--recenter-display, block)"
        }}
      >
        <ion-icon
          src={RecenterIcon}
          slot="start"
          title={this._contentStrings.recenter}
        />
        <ion-button
          slot="end"
          size="small"
          onClick={() => {
            this.recenter.emit();
          }}
        >
          {this._contentStrings.recenter}
        </ion-button>
      </ion-item>
    );
  }

  public renderUnitsSelect() {
    return (
      <ion-item
        style={{
          display: "var(--units-display, block)"
        }}
      >
        <ion-icon
          src={UnitsIcon}
          slot="start"
          title={this._contentStrings.units}
        />
        <select
          slot="end"
          onChange={e =>
            this._units((e.srcElement as HTMLSelectElement).value as Units)
          }
        >
          <option selected={this.units === Units.METERS} value={Units.METERS}>
            {this._contentStrings.meters}
          </option>
          <option
            selected={this.units === Units.MILLIMETERS}
            value={Units.MILLIMETERS}
          >
            {this._contentStrings.millimeters}
          </option>
        </select>
      </ion-item>
    );
  }

  // public renderMaterialSelect() {
  //   return (
  //     <ion-item
  //       style={{
  //         display: "var(--material-display, block)"
  //       }}
  //     >
  //       <ion-icon
  //         src={MaterialIcon}
  //         slot="start"
  //         title={this._contentStrings.material}
  //       />
  //       <select
  //         slot="end"
  //         onChange={e =>
  //           this._material((e.srcElement as HTMLSelectElement)
  //             .value as Material)
  //         }
  //       >
  //         <option
  //           selected={this.material === Material.DEFAULT}
  //           value={Material.DEFAULT}
  //         >
  //           {this._contentStrings.default}
  //         </option>
  //         <option
  //           selected={this.material === Material.CLAY}
  //           value={Material.CLAY}
  //         >
  //           {this._contentStrings.clay}
  //         </option>
  //         <option
  //           selected={this.material === Material.NORMALS}
  //           value={Material.NORMALS}
  //         >
  //           {this._contentStrings.normals}
  //         </option>
  //         <option
  //           selected={this.material === Material.WIREFRAME}
  //           value={Material.WIREFRAME}
  //         >
  //           {this._contentStrings.wireframe}
  //         </option>
  //         <option
  //           selected={this.material === Material.XRAY}
  //           value={Material.XRAY}
  //         >
  //           {this._contentStrings.xray}
  //         </option>
  //       </select>
  //     </ion-item>
  //   );
  // }

  public renderGenericOptions() {
    return [
      this.renderBoundingBoxEnabled(),
      this.renderControlsTypeSelect(),
      this.renderRecenterButton(),
      this.renderUnitsSelect()
    ];
  }

  public renderOptions() {
    switch (this.displayMode) {
      case DisplayMode.SLICES: {
        return (
          <div>
            {this.renderGenericOptions()}
            <ion-item
              style={{
                display: "var(--slices-index-display, block)"
              }}
            >
              <ion-icon
                src={SliderIcon}
                slot="start"
                title={this._contentStrings.sliceIndex}
              />
              <ion-range
                slot="end"
                min="0"
                max="1"
                step={1 / this.slicesMaxIndex}
                value={this.slicesIndex}
                onIonChange={e => this._slicesIndex(e.detail.value)}
              />
            </ion-item>
            <ion-item
              style={{
                display: "var(--slices-orientation-display, block)"
              }}
            >
              <ion-icon
                src={OrientationIcon}
                slot="start"
                title={this._contentStrings.orientation}
              />
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
                display: "var(--slices-brightness-display, block)"
              }}
            >
              <ion-icon
                src={BrightnessIcon}
                slot="start"
                title={this._contentStrings.brightness}
              />
              <ion-range
                slot="end"
                min="0"
                max="1"
                step=".1"
                value={this.slicesBrightness}
                onIonChange={e => this._slicesBrightness(e.detail.value)}
              />
            </ion-item>
            <ion-item
              style={{
                display: "var(--slices-contrast-display, block)"
              }}
            >
              <ion-icon
                src={ContrastIcon}
                slot="start"
                title={this._contentStrings.contrast}
              />
              <ion-range
                slot="end"
                min="0"
                max="1"
                step=".1"
                value={this.slicesContrast}
                onIonChange={e => this._slicesContrast(e.detail.value)}
              />
            </ion-item>
          </div>
        );
      }
      case DisplayMode.VOLUME: {
        return (
          <div>
            {this.renderGenericOptions()}
            {
              <ion-item
                style={{
                  display: "var(--volume-steps-display, block)"
                }}
              >
                <ion-icon
                  src={SliderIcon}
                  slot="start"
                  title={this._contentStrings.volumeSteps}
                />
                <ion-range
                  slot="end"
                  min="0"
                  max="1"
                  value={this.volumeSteps}
                  step="0.1"
                  onMouseUp={e => this._volumeSteps(e.srcElement.value)}
                />
              </ion-item>
            }
            {/* <ion-item>
                <ion-label>LUT</ion-label>
                <select onChange={ (e) => this.onVolumeLutChanged.emit(e.detail.value) }>
                {
                  this.luts.split(',').forEach((lut: string) => {
                    return <option value={lut}>{lut}</option>;
                  })
                }
                </ion-select>
              </ion-item> */}
            <ion-item
              style={{
                display: "var(--volume-brightness-display, block)"
              }}
            >
              <ion-icon
                src={BrightnessIcon}
                slot="start"
                title={this._contentStrings.brightness}
              />
              <ion-range
                slot="end"
                min="0"
                max="1"
                step="0.1"
                value={this.volumeBrightness}
                onIonChange={e => {
                  this._volumeBrightness(e.detail.value);
                }}
              />
            </ion-item>
            <ion-item
              style={{
                display: "var(--volume-contrast-display, block)"
              }}
            >
              <ion-icon
                src={ContrastIcon}
                slot="start"
                title={this._contentStrings.contrast}
              />
              <ion-range
                slot="end"
                min="0"
                max="1"
                step="0.1"
                value={this.volumeContrast}
                onIonChange={e => this._volumeContrast(e.detail.value)}
              />
            </ion-item>
          </div>
        );
      }
      case DisplayMode.MESH: {
        return this.renderGenericOptions();
      }
      default: {
        return;
      }
    }
  }

  public render() {
    return [
      this.renderDisplayModeToggle(),
      this.renderGraphEnabled(),
      this.renderOptions()
    ];
  }
}
