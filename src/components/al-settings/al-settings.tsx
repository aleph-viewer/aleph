import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import AlertIcon from "../../assets/svg/alert.svg";
import { Orientation } from "../../enums";
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

  @Event() public displayModeChanged: EventEmitter;
  @Event() public orientationChanged: EventEmitter;
  @Event() public slicesIndexChanged: EventEmitter;
  @Event() public slicesBrightnessChanged: EventEmitter;
  @Event() public slicesContrastChanged: EventEmitter;
  @Event() public volumeBrightnessChanged: EventEmitter;
  @Event() public volumeContrastChanged: EventEmitter;
  @Event() public volumeStepsChanged: EventEmitter;
  @Event() public volumeStepsHighEnabledChanged: EventEmitter;

  @Prop({ mutable: true }) public displayMode: DisplayMode;
  @Prop({ mutable: true }) public orientation: Orientation;
  @Prop({ mutable: true }) public slicesIndex: number;
  @Prop({ mutable: true }) public slicesMaxIndex: number;
  @Prop({ mutable: true }) public slicesBrightness: number; // window center
  @Prop({ mutable: true }) public slicesContrast: number; // window width
  @Prop({ mutable: true }) public volumeBrightness: number; // window center
  @Prop({ mutable: true }) public volumeContrast: number; // window width
  @Prop({ mutable: true }) public volumeSteps: number;
  @Prop({ mutable: true }) public volumeStepsHighEnabled: boolean;

  private _displayMode(displayMode: DisplayMode) {
    this.displayMode = displayMode;
    this.displayModeChanged.emit(displayMode);
  }

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
            min={0}
            max={1}
            step={1 / this.slicesMaxIndex}
            value={this.slicesIndex}
            onIonChange={e => this._slicesIndex(e.detail.value as number)}
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
            min={0}
            max={1}
            step={0.05}
            snaps={true}
            ticks={false}
            value={this.slicesBrightness}
            onIonChange={e => {
              this._slicesBrightness(e.detail.value as number);
            }}
          />
        </ion-item>
        <ion-item
          style={{
            display: "var(--slices-contrast-display, block)"
          }}
        >
          <span>{this._contentStrings.contrast}</span>
          <ion-range
            slot="end"
            min={0}
            max={1}
            step={0.05}
            snaps={true}
            ticks={false}
            value={this.slicesContrast}
            onIonChange={e => this._slicesContrast(e.detail.value as number)}
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
            min={0}
            max={1}
            step={0.05}
            snaps={true}
            ticks={false}
            value={this.volumeBrightness}
            onIonChange={e => {
              this._volumeBrightness(e.detail.value as number);
            }}
          />
        </ion-item>
        <ion-item
          style={{
            display: "var(--volume-contrast-display, block)"
          }}
        >
          <span>{this._contentStrings.contrast}</span>
          <ion-range
            slot="end"
            min={0}
            max={1}
            step={0.05}
            snaps={true}
            ticks={false}
            value={this.volumeContrast}
            onIonChange={e => this._volumeContrast(e.detail.value as number)}
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
        {this.renderDisplayModeToggle()}
        {this.renderOptions()}
      </div>
    );
  }
}
