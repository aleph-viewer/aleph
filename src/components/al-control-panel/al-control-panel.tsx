import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop,
  Watch
} from "@stencil/core";
import { Constants } from "../../Constants";
import { ControlsType, Material, Orientation, Units } from "../../enums";
import { DisplayMode } from "../../enums/DisplayMode";
import { getLocaleComponentStrings } from "../../utils/Locale";
import { ContentStrings } from "./ContentStrings";
@Component({
  tag: "al-control-panel",
  styleUrl: "al-control-panel.css",
  shadow: true
})
export class AlControlPanel {
  private _contentStrings: ContentStrings;
  private _lastStackOrientationIndex: number;

  @Element() private _element: HTMLElement;

  @Event() public boundingBoxEnabledChanged: EventEmitter;
  @Event() public controlsTypeChanged: EventEmitter;
  @Event() public displayModeChanged: EventEmitter;
  @Event() public materialChanged: EventEmitter;
  @Event() public orientationChanged: EventEmitter;
  @Event() public recenter: EventEmitter;
  @Event() public slicesIndexChanged: EventEmitter;
  @Event() public slicesWindowCenterChanged: EventEmitter;
  @Event() public slicesWindowWidthChanged: EventEmitter;
  @Event() public unitsChanged: EventEmitter;
  @Event() public graphEnabledChanged: EventEmitter;
  @Event() public volumeStepsChanged: EventEmitter;
  @Event() public volumeWindowCenterChanged: EventEmitter;
  @Event() public volumeWindowWidthChanged: EventEmitter;

  @Prop({ mutable: true }) public boundingBoxEnabled: boolean = false;
  @Prop({ mutable: true }) public controlsType: ControlsType =
    ControlsType.ORBIT;
  @Prop({ mutable: true }) public displayMode: DisplayMode = DisplayMode.MESH;
  @Prop({ mutable: true }) public material: Material = Material.DEFAULT;
  @Prop({ mutable: true }) public orientation: Orientation =
    Orientation.CORONAL;
  @Prop({ mutable: true }) public slicesIndex: number;
  @Prop({ mutable: true }) public slicesWindowCenter: number;
  @Prop({ mutable: true }) public slicesWindowWidth: number;
  @Prop({ mutable: true }) public stackhelper:
    | AMI.StackHelper
    | AMI.VolumeRenderHelper;
  @Watch("stackhelper")
  public watchStackhelper() {
    this.slicesIndex = undefined;
    this.slicesWindowCenter = undefined;
    this.slicesWindowWidth = undefined;
    this.volumeSteps = undefined;
    this.volumeWindowCenter = undefined;
    this.volumeWindowWidth = undefined;
  }
  @Prop({ mutable: true }) public graphEnabled: boolean = false;
  @Prop({ mutable: true }) public units: Units = Units.METERS;
  @Prop({ mutable: true }) public volumeSteps: number;
  @Prop({ mutable: true }) public volumeWindowCenter: number;
  @Prop({ mutable: true }) public volumeWindowWidth: number;

  protected async componentWillLoad(): Promise<void> {
    this._contentStrings = await getLocaleComponentStrings(this._element);
  }

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

  private _material(material: Material) {
    this.material = material;
    this.materialChanged.emit(material);
  }

  private _orientation(orientation: Orientation) {
    this.orientation = orientation;
    this.orientationChanged.emit(orientation);
  }

  private _slicesIndex(index: number) {
    this.slicesIndex = index;
    this.slicesIndexChanged.emit(index);
  }

  private _slicesWindowCenter(center: number) {
    this.slicesWindowCenter = center;
    this.slicesWindowCenterChanged.emit(center);
  }

  private _slicesWindowWidth(width: number) {
    this.slicesWindowWidth = width;
    this.slicesWindowWidthChanged.emit(width);
  }

  private _units(units: Units) {
    this.units = units;
    this.unitsChanged.emit(units);
  }

  private _volumeSteps(steps: number) {
    this.volumeSteps = steps;
    this.volumeStepsChanged.emit(steps);
  }

  private _volumeWindowCenter(center: number) {
    this.volumeWindowCenter = center;
    this.volumeWindowCenterChanged.emit(center);
  }

  private _volumeWindowWidth(width: number) {
    this.volumeWindowWidth = width;
    this.volumeWindowWidthChanged.emit(width);
  }

  public renderDisplayModeToggle() {
    if (this.displayMode !== DisplayMode.MESH) {
      return (
        <ion-item
          style={{
            display: "var(--display-mode-display, block)"
          }}
        >
          <ion-icon src="/assets/svg/display-mode.svg" slot="start" />
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

  public renderNodesToggle() {
    return (
      <ion-item
        style={{
          display: "var(--graph-enabled-display, block)"
        }}
      >
        <ion-icon src="/assets/svg/annotate.svg" slot="start" />
        <ion-toggle
          slot="end"
          checked={this.graphEnabled}
          onIonChange={e => this._graphEnabled(e.detail.checked)}
        />
      </ion-item>
    );
  }

  public renderBoundingBoxEnabled() {
    return (
      <ion-item
        style={{
          display: "var(--bounding-box-enabled-display, block)"
        }}
      >
        <ion-icon src="/assets/svg/bounding-box.svg" slot="start" />
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
        <ion-icon src="/assets/svg/controls-type.svg" slot="start" />
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
        <ion-icon src="/assets/svg/recenter.svg" slot="start" />
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
        <ion-icon src="/assets/svg/units.svg" slot="start" />
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

  public renderMaterialSelect() {
    return (
      <ion-item
        style={{
          display: "var(--material-display, block)"
        }}
      >
        <ion-icon src="/assets/svg/material.svg" slot="start" />
        <select
          slot="end"
          onChange={e =>
            this._material((e.srcElement as HTMLSelectElement)
              .value as Material)
          }
        >
          <option
            selected={this.material === Material.DEFAULT}
            value={Material.DEFAULT}
          >
            {this._contentStrings.default}
          </option>
          <option
            selected={this.material === Material.CLAY}
            value={Material.CLAY}
          >
            {this._contentStrings.clay}
          </option>
          <option
            selected={this.material === Material.NORMALS}
            value={Material.NORMALS}
          >
            {this._contentStrings.normals}
          </option>
          <option
            selected={this.material === Material.WIREFRAME}
            value={Material.WIREFRAME}
          >
            {this._contentStrings.wireframe}
          </option>
          <option
            selected={this.material === Material.XRAY}
            value={Material.XRAY}
          >
            {this._contentStrings.xray}
          </option>
        </select>
      </ion-item>
    );
  }

  public renderGenericOptions() {
    return [
      this.renderBoundingBoxEnabled(),
      this.renderControlsTypeSelect(),
      this.renderRecenterButton(),
      this.renderUnitsSelect()
    ];
  }

  private _reverseNumber(num: number, min: number, max: number): number {
    return max + min - num;
  }

  public renderOptions() {
    switch (this.displayMode) {
      case DisplayMode.SLICES: {
        if (
          !this.stackhelper ||
          (this.stackhelper && !(this.stackhelper as AMI.StackHelper).slice)
        ) {
          break;
        }

        const orientationIndex: number = Object.keys(Orientation).indexOf(
          this.orientation.toUpperCase()
        );

        // based off zCosine, x:1 = saggital, y:1 = coronal, z:1 = axial
        const zCosine: THREE.Vector3 = this.stackhelper.stack
          .zCosine as THREE.Vector3;

        let orientationOffset;
        // If DICOM's up axis is X, offset the viewer's orientation by 1
        if (Math.round(zCosine.x) === 1) {
          orientationOffset = 1;
        }
        // If the DICOM's up is Y, offset the viewer's orientation by 2
        else if (Math.round(zCosine.y) === 1) {
          orientationOffset = 2;
        }
        // Else Orientation matches viewer orientation, no offset
        else {
          orientationOffset = 0;
        }

        // Wrap the orientationIndex so that it may never exceed 2
        const displayOrientationIndex = Math.round(
          (orientationIndex + orientationOffset) % 3
        );
        const stackOrientationIndex = Math.round(
          (orientationIndex + orientationOffset + 2) % 3
        );

        const indexMax: number =
          this.stackhelper.stack.dimensionsIJK[
            Object.keys(this.stackhelper.stack.dimensionsIJK)[
              stackOrientationIndex
            ]
          ] - 1;
        let index: number;

        if (
          stackOrientationIndex !== this._lastStackOrientationIndex ||
          this.slicesIndex === undefined
        ) {
          // set default
          index = Math.floor(indexMax / 2);
        } else {
          index = this.slicesIndex;
        }

        this._lastStackOrientationIndex = stackOrientationIndex;

        const windowWidthMin: number = 1;
        const windowWidthMax: number =
          this.stackhelper.stack.minMax[1] - this.stackhelper.stack.minMax[0];
        let windowWidth: number;

        if (this.slicesWindowWidth === undefined) {
          // set default
          windowWidth = windowWidthMax / 2;
        } else {
          windowWidth = this.slicesWindowWidth;
        }

        const windowCenterMin: number = this.stackhelper.stack.minMax[0];
        const windowCenterMax: number = this.stackhelper.stack.minMax[1];
        let windowCenter: number;

        if (this.slicesWindowCenter === undefined) {
          // set default
          windowCenter = windowCenterMax / 2;
        } else {
          windowCenter = this.slicesWindowCenter;
        }

        // update the stackhelper
        (this
          .stackhelper as AMI.StackHelper).orientation = displayOrientationIndex;
        (this.stackhelper as AMI.StackHelper).index = index;
        (this.stackhelper as AMI.StackHelper).slice.windowWidth = windowWidth;
        (this.stackhelper as AMI.StackHelper).slice.windowCenter = windowCenter;

        return (
          <div>
            {this.renderGenericOptions()}
            <ion-item
              style={{
                display: "var(--slices-index-display, block)"
              }}
            >
              <ion-icon src="/assets/svg/slider.svg" slot="start" />
              <ion-range
                slot="end"
                min="0"
                max={indexMax}
                value={index}
                pin={true}
                onIonChange={e => this._slicesIndex(e.detail.value)}
              />
            </ion-item>
            <ion-item
              style={{
                display: "var(--slices-orientation-display, block)"
              }}
            >
              <ion-icon src="/assets/svg/orientation.svg" slot="start" />
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
                display: "var(--slices-window-center-display, block)"
              }}
            >
              <ion-icon src="/assets/svg/brightness.svg" slot="start" />
              <ion-range
                slot="end"
                min={windowCenterMin}
                max={windowCenterMax}
                value={this._reverseNumber(
                  windowCenter,
                  windowCenterMin,
                  windowCenterMax
                )}
                onIonChange={e =>
                  this._slicesWindowCenter(
                    this._reverseNumber(
                      e.detail.value,
                      windowCenterMin,
                      windowCenterMax
                    )
                  )
                }
              />
            </ion-item>
            <ion-item
              style={{
                display: "var(--slices-window-width-display, block)"
              }}
            >
              <ion-icon src="/assets/svg/contrast.svg" slot="start" />
              <ion-range
                slot="end"
                min={windowWidthMin}
                max={windowWidthMax}
                value={this._reverseNumber(
                  windowWidth,
                  windowWidthMin,
                  windowWidthMax
                )}
                onIonChange={e =>
                  this._slicesWindowWidth(
                    this._reverseNumber(
                      e.detail.value,
                      windowWidthMin,
                      windowWidthMax
                    )
                  )
                }
              />
            </ion-item>
          </div>
        );
      }
      case DisplayMode.VOLUME: {
        if (!this.stackhelper) {
          break;
        }

        let steps: number;

        if (this.volumeSteps === undefined) {
          // set default
          steps = 16;
        } else {
          steps = this.volumeSteps;
        }

        const windowWidthMin: number = 1;
        const windowWidthMax: number =
          this.stackhelper.stack.minMax[1] - this.stackhelper.stack.minMax[0];
        let windowWidth: number;

        if (this.volumeWindowWidth === undefined) {
          // set default
          windowWidth = windowWidthMax / 2;
        } else {
          windowWidth = this.volumeWindowWidth;
        }

        const windowCenterMin: number = this.stackhelper.stack.minMax[0];
        const windowCenterMax: number = this.stackhelper.stack.minMax[1];
        let windowCenter: number;

        if (this.volumeWindowCenter === undefined) {
          // set default
          windowCenter = windowCenterMax / 2;
        } else {
          windowCenter = this.volumeWindowCenter;
        }

        // const volumeLuts: string = this._lut.lutsAvailable().join(',');

        // update the stackhelper
        (this.stackhelper as AMI.VolumeRenderHelper).steps = steps;
        (this.stackhelper as AMI.VolumeRenderHelper).windowWidth = windowWidth;
        (this
          .stackhelper as AMI.VolumeRenderHelper).windowCenter = windowCenter;

        return (
          <div>
            {this.renderGenericOptions()}
            <ion-item
              style={{
                display: "var(--volume-steps-display, block)"
              }}
            >
              <ion-icon src="/assets/svg/slider.svg" slot="start" />
              <ion-range
                slot="end"
                min={Constants.stepsMin}
                max={Constants.stepsMax}
                value={steps}
                step={Constants.stepsIncrement}
                pin={true}
                onIonChange={e => this._volumeSteps(e.detail.value)}
              />
            </ion-item>
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
                display: "var(--volume-window-center-display, block)"
              }}
            >
              <ion-icon src="/assets/svg/brightness.svg" slot="start" />
              <ion-range
                slot="end"
                min={windowCenterMin}
                max={windowCenterMax}
                value={this._reverseNumber(
                  windowCenter,
                  windowCenterMin,
                  windowCenterMax
                )}
                onIonChange={e => {
                  this._volumeWindowCenter(
                    this._reverseNumber(
                      e.detail.value,
                      windowCenterMin,
                      windowCenterMax
                    )
                  );
                }}
              />
            </ion-item>
            <ion-item
              style={{
                display: "var(--volume-window-width-display, block)"
              }}
            >
              <ion-icon src="/assets/svg/contrast.svg" slot="start" />
              <ion-range
                slot="end"
                min={windowWidthMin}
                max={windowWidthMax}
                value={this._reverseNumber(
                  windowWidth,
                  windowWidthMin,
                  windowWidthMax
                )}
                onIonChange={e =>
                  this._volumeWindowWidth(
                    this._reverseNumber(
                      e.detail.value,
                      windowWidthMin,
                      windowWidthMax
                    )
                  )
                }
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

    return null;
  }

  public render() {
    return [
      this.renderDisplayModeToggle(),
      this.renderNodesToggle(),
      this.renderOptions()
    ];
  }
}
