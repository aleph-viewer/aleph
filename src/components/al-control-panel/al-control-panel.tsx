import { Component, Prop, Event, EventEmitter, Watch } from "@stencil/core";
import { DisplayMode } from "../../enums/DisplayMode";
import { Orientation } from "../../enums/Orientation";

@Component({
  tag: "al-control-panel",
  styleUrl: "al-control-panel.css",
  shadow: true
})
export class AlControlPanel {
  private _lastStackOrientationIndex: number;

  @Event() boundingBoxEnabledChanged: EventEmitter;
  @Event() displayModeChanged: EventEmitter;
  @Event() orientationChanged: EventEmitter;
  @Event() recenter: EventEmitter;
  @Event() slicesIndexChanged: EventEmitter;
  @Event() slicesWindowCenterChanged: EventEmitter;
  @Event() slicesWindowWidthChanged: EventEmitter;
  @Event() graphEnabledChanged: EventEmitter;
  @Event() volumeStepsChanged: EventEmitter;
  @Event() volumeWindowCenterChanged: EventEmitter;
  @Event() volumeWindowWidthChanged: EventEmitter;

  @Prop({ mutable: true }) boundingBoxEnabled: boolean = false;
  @Prop({ mutable: true }) displayMode: DisplayMode = DisplayMode.MESH;
  @Prop({ mutable: true }) orientation: Orientation = Orientation.CORONAL;
  @Prop({ mutable: true }) slicesIndex: number;
  @Prop({ mutable: true }) slicesWindowCenter: number;
  @Prop({ mutable: true }) slicesWindowWidth: number;
  @Prop({ mutable: true }) stackhelper:
    | AMI.StackHelper
    | AMI.VolumeRenderHelper;
  @Watch("stackhelper")
  watchStackhelper() {
    this.slicesIndex = undefined;
    this.slicesWindowCenter = undefined;
    this.slicesWindowWidth = undefined;
    this.volumeSteps = undefined;
    this.volumeWindowCenter = undefined;
    this.volumeWindowWidth = undefined;
  }
  @Prop({ mutable: true }) graphEnabled: boolean = false;
  @Prop({ mutable: true }) volumeSteps: number;
  @Prop({ mutable: true }) volumeWindowCenter: number;
  @Prop({ mutable: true }) volumeWindowWidth: number;

  private _boundingBoxEnabled(enabled: boolean) {
    this.boundingBoxEnabled = enabled;
    this.boundingBoxEnabledChanged.emit(enabled);
  }

  private _displayMode(displayMode: DisplayMode) {
    this.displayMode = displayMode;
    this.displayModeChanged.emit(displayMode);
  }

  private _graphEnabled(enabled: boolean) {
    this.graphEnabled = enabled;
    this.graphEnabledChanged.emit(enabled);
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

  renderDisplayModeToggle() {
    if (this.displayMode !== DisplayMode.MESH) {
      return (
        <ion-item
          style={{
            display: "var(--display-mode-display, block)"
          }}
        >
          <ion-icon name="eye" slot="start" />
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
              Slices
            </option>
            <option
              selected={this.displayMode === DisplayMode.VOLUME}
              value={DisplayMode.VOLUME}
            >
              Volume
            </option>
          </select>
        </ion-item>
      );
    }

    return null;
  }

  renderNodesToggle() {
    return (
      <ion-item
        style={{
          display: "var(--graph-enabled-display, block)"
        }}
      >
        <ion-icon name="add-circle" slot="start" />
        <ion-toggle
          slot="end"
          checked={this.graphEnabled}
          onIonChange={e => this._graphEnabled(e.detail.checked)}
        />
      </ion-item>
    );
  }

  renderBoundingBoxEnabled() {
    return (
      <ion-item
        style={{
          display: "var(--bounding-box-enabled-display, block)"
        }}
      >
        <ion-icon name="cube" slot="start" />
        <ion-toggle
          slot="end"
          checked={this.boundingBoxEnabled}
          onIonChange={e => this._boundingBoxEnabled(e.detail.checked)}
        />
      </ion-item>
    );
  }

  renderRecenterButton() {
    return (
      <ion-item
        style={{
          display: "var(--recenter-display, block)"
        }}
      >
        <ion-icon name="log-in" slot="start" />
        <ion-button
          slot="end"
          size="small"
          onClick={() => {
            this.recenter.emit();
          }}
        >
          <ion-icon name="log-in" />
        </ion-button>
      </ion-item>
    );
  }

  renderGenericOptions() {
    return [this.renderBoundingBoxEnabled(), this.renderRecenterButton()];
  }

  private _reverseNumber(num: number, min: number, max: number): number {
    return max + min - num;
  }

  renderOptions() {
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
              <ion-icon name="swap" slot="start" />
              <ion-range
                slot="end"
                min="0"
                max={indexMax}
                value={index}
                onIonChange={e => this._slicesIndex(e.detail.value)}
              />
            </ion-item>
            <ion-item
              style={{
                display: "var(--slices-orientation-display, block)"
              }}
            >
              <ion-icon name="compass" slot="start" />
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
                  Coronal
                </option>
                <option
                  selected={this.orientation === Orientation.SAGGITAL}
                  value={Orientation.SAGGITAL}
                >
                  Saggital
                </option>
                <option
                  selected={this.orientation === Orientation.AXIAL}
                  value={Orientation.AXIAL}
                >
                  Axial
                </option>
              </select>
            </ion-item>
            <ion-item
              style={{
                display: "var(--slices-window-center-display, block)"
              }}
            >
              <ion-icon name="sunny" slot="start" />
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
              <ion-icon name="contrast" slot="start" />
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

        const stepsMin: number = 1;
        const stepsMax: number = 128;
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

        //const volumeLuts: string = this._lut.lutsAvailable().join(',');

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
              <ion-icon name="swap" slot="start" />
              <ion-range
                slot="end"
                min={stepsMin}
                max={stepsMax}
                value={steps}
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
              <ion-icon name="sunny" slot="start" />
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
              <ion-icon name="contrast" slot="start" />
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
    }

    return null;
  }

  render() {
    return [
      this.renderDisplayModeToggle(),
      this.renderNodesToggle(),
      this.renderOptions()
    ];
  }
}
