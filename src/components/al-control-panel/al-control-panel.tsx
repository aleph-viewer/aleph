import { Component, Prop, Event, EventEmitter } from "@stencil/core";
import { DisplayMode } from "../../enums/DisplayMode";
import { Orientation } from "../../enums/Orientation";

@Component({
  tag: "al-control-panel",
  styleUrl: "al-control-panel.css",
  shadow: true
})
export class AlControlPanel {
  @Event() onBoundingBoxVisibleChanged: EventEmitter;
  @Event() onDisplayModeChanged: EventEmitter;
  @Event() onOptionsEnabledChanged: EventEmitter;
  @Event() onOrientationChanged: EventEmitter;
  @Event() onSlicesIndexChanged: EventEmitter;
  @Event() onSlicesWindowCenterChanged: EventEmitter;
  @Event() onSlicesWindowWidthChanged: EventEmitter;
  @Event() onGraphEnabledChanged: EventEmitter;
  @Event() onVolumeStepsChanged: EventEmitter;
  @Event() onVolumeWindowCenterChanged: EventEmitter;
  @Event() onVolumeWindowWidthChanged: EventEmitter;

  @Prop({ mutable: true }) boundingBoxVisible: boolean = false;
  @Prop({ mutable: true }) displayMode: DisplayMode = DisplayMode.MESH;
  @Prop({ mutable: true }) optionsEnabled: boolean = true;
  @Prop({ mutable: true }) optionsVisible: boolean = true;
  @Prop({ mutable: true }) orientation: Orientation = Orientation.CORONAL;
  @Prop({ mutable: true }) slicesIndex: number;
  @Prop({ mutable: true }) slicesWindowCenter: number;
  @Prop({ mutable: true }) slicesWindowWidth: number;
  @Prop({ mutable: true }) stack: any;
  @Prop({ mutable: true }) stackhelper:
    | AMI.StackHelper
    | AMI.VolumeRenderingHelper;
  @Prop({ mutable: true }) graphEnabled: boolean = false;
  @Prop({ mutable: true }) graphVisible: boolean = true;
  @Prop({ mutable: true }) volumeSteps: number;
  @Prop({ mutable: true }) volumeWindowCenter: number;
  @Prop({ mutable: true }) volumeWindowWidth: number;

  private _boundingBoxVisible(visible: boolean) {
    this.boundingBoxVisible = visible;
    this.onBoundingBoxVisibleChanged.emit(visible);
  }

  private _displayMode(displayMode: DisplayMode) {
    this.displayMode = displayMode;
    this.onDisplayModeChanged.emit(displayMode);
  }

  // private _optionsEnabled(enabled: boolean) {
  //   this.optionsEnabled = enabled;
  //   this.onOptionsEnabledChanged.emit(enabled);
  // }

  // private _optionsVisible(visible: boolean) {
  //   this.optionsVisible = visible;
  // }

  private _graphEnabled(enabled: boolean) {
    this.graphEnabled = enabled;
    this.onGraphEnabledChanged.emit(enabled);
  }

  private _orientation(orientation: Orientation) {
    this.orientation = orientation;
    this.onOrientationChanged.emit(orientation);
  }

  private _slicesIndex(index: number) {
    this.slicesIndex = index;
    this.onSlicesIndexChanged.emit(index);
  }

  private _slicesWindowCenter(center: number) {
    this.slicesWindowCenter = center;
    this.onSlicesWindowCenterChanged.emit(center);
  }

  private _slicesWindowWidth(width: number) {
    this.slicesWindowWidth = width;
    this.onSlicesWindowWidthChanged.emit(width);
  }

  private _volumeSteps(steps: number) {
    this.volumeSteps = steps;
    this.onVolumeStepsChanged.emit(steps);
  }

  private _volumeWindowCenter(center: number) {
    this.volumeWindowCenter = center;
    this.onVolumeWindowCenterChanged.emit(center);
  }

  private _volumeWindowWidth(width: number) {
    this.volumeWindowWidth = width;
    this.onVolumeWindowWidthChanged.emit(width);
  }

  renderDisplayModeToggle(): JSX.Element {
    if (this.displayMode !== DisplayMode.MESH) {
      return (
        <ion-item id="mode">
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

  renderNodesToggle(): JSX.Element {
    if (this.graphVisible) {
      return (
        <ion-item>
          <ion-icon name="add-circle" slot="start" />
          <ion-toggle
            slot="end"
            checked={this.graphEnabled}
            onIonChange={e => this._graphEnabled(e.detail.checked)}
          />
        </ion-item>
      );
    }

    return null;
  }

  /*
  renderOptionsToggle(): JSX.Element {
    if (this.optionsVisible) {
      return (
        <ion-item>
          <ion-icon name="options" slot="start" />
          <ion-toggle
            slot="end"
            checked={this.optionsEnabled}
            onIonChange={e => this._optionsEnabled(e.detail.checked)}
          />
        </ion-item>
      );
    }
  }
  */

  renderBoundingBoxEnabled(): JSX.Element {
    return (
      <ion-item>
        <ion-icon name="cube" slot="start" />
        <ion-toggle
          slot="end"
          checked={this.boundingBoxVisible}
          onIonChange={e => this._boundingBoxVisible(e.detail.checked)}
        />
      </ion-item>
    );
  }

  private _reverseNumber(num: number, min: number, max: number): number {
    return max + min - num;
  }

  renderOptions(): JSX.Element {
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
        const zCosine: THREE.Vector3 = this.stack.zCosine as THREE.Vector3;

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
          this.stack.dimensionsIJK[
            Object.keys(this.stack.dimensionsIJK)[stackOrientationIndex]
          ] - 1;
        let index: number;

        if (this.slicesIndex === undefined) {
          // set default
          index = Math.floor(indexMax / 2);
        } else {
          index = this.slicesIndex;
        }

        const windowWidthMin: number = 1;
        const windowWidthMax: number =
          this.stack.minMax[1] - this.stack.minMax[0];
        let windowWidth: number;

        if (this.slicesWindowWidth === undefined) {
          // set default
          windowWidth = windowWidthMax / 2;
        } else {
          windowWidth = this.slicesWindowWidth;
        }

        const windowCenterMin: number = this.stack.minMax[0];
        const windowCenterMax: number = this.stack.minMax[1];
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

        if (this.optionsVisible && this.optionsEnabled) {
          return (
            <div>
              {this.renderBoundingBoxEnabled()}
              <ion-item>
                <ion-icon name="swap" slot="start" />
                <ion-range
                  slot="end"
                  min="0"
                  max={indexMax}
                  value={index}
                  onIonChange={e => this._slicesIndex(e.detail.value)}
                />
              </ion-item>
              <ion-item>
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
                    Coronal (x)
                  </option>
                  <option
                    selected={this.orientation === Orientation.SAGGITAL}
                    value={Orientation.SAGGITAL}
                  >
                    Saggital (y)
                  </option>
                  <option
                    selected={this.orientation === Orientation.AXIAL}
                    value={Orientation.AXIAL}
                  >
                    Axial (z)
                  </option>
                </select>
              </ion-item>
              <ion-item>
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
              <ion-item>
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
        } else {
          return null;
        }
      }
      case DisplayMode.VOLUME: {
        if (
          !this.stackhelper ||
          (this.stackhelper &&
            !(this.stackhelper as AMI.VolumeRenderingHelper).uniforms)
        ) {
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
          this.stack.minMax[1] - this.stack.minMax[0];
        let windowWidth: number;

        if (this.volumeWindowWidth === undefined) {
          // set default
          windowWidth = windowWidthMax / 2;
        } else {
          windowWidth = this.volumeWindowWidth;
        }

        const windowCenterMin: number = this.stack.minMax[0];
        const windowCenterMax: number = this.stack.minMax[1];
        let windowCenter: number;

        if (this.volumeWindowCenter === undefined) {
          // set default
          windowCenter = windowCenterMax / 2;
        } else {
          windowCenter = this.volumeWindowCenter;
        }

        //const volumeLuts: string = this._lut.lutsAvailable().join(',');

        // update the stackhelper
        (this
          .stackhelper as AMI.VolumeRenderingHelper).uniforms.uSteps.value = steps;
        (this
          .stackhelper as AMI.VolumeRenderingHelper).windowWidth = windowWidth;
        (this
          .stackhelper as AMI.VolumeRenderingHelper).windowCenter = windowCenter;

        //if (this.optionsVisible && this.optionsEnabled) {
        return (
          <div>
            {this.renderBoundingBoxEnabled()}
            <ion-item>
              <ion-icon name="swap" slot="start" />
              <ion-range
                slot="end"
                min={stepsMin}
                max={stepsMax}
                value={steps}
                onMouseUp={e => this._volumeSteps((e.srcElement as any).value)}
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
            <ion-item>
              <ion-icon name="sunny" slot="start" />
              <ion-range
                slot="end"
                min={windowCenterMin}
                max={windowCenterMax}
                value={windowCenter}
                onMouseUp={e =>
                  this._volumeWindowCenter((e.srcElement as any).value)
                }
              />
            </ion-item>
            <ion-item>
              <ion-icon name="contrast" slot="start" />
              <ion-range
                slot="end"
                min={windowWidthMin}
                max={windowWidthMax}
                value={windowWidth}
                onMouseUp={e =>
                  this._volumeWindowWidth((e.srcElement as any).value)
                }
              />
            </ion-item>
          </div>
        );
        //}
      }
      case DisplayMode.MESH: {
        return this.renderBoundingBoxEnabled();
      }
    }

    return null;
  }

  render(): JSX.Element {
    return [
      this.renderDisplayModeToggle(),
      this.renderNodesToggle(),
      //this.renderOptionsToggle(),
      this.renderOptions()
    ];
  }
}
