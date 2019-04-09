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
  @Prop({ mutable: true }) optionsEnabled: boolean = false;
  @Prop({ mutable: true }) optionsVisible: boolean = true;
  @Prop({ mutable: true }) orientation: Orientation = Orientation.CORONAL;
  @Prop({ mutable: true }) slicesIndex: number;
  @Prop({ mutable: true }) slicesWindowCenter: number;
  @Prop({ mutable: true }) slicesWindowWidth: number;
  @Prop({ mutable: true }) stack: any;
  @Prop({ mutable: true }) stackhelper: AMI.StackHelper;
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

  private _optionsEnabled(enabled: boolean) {
    this.optionsEnabled = enabled;
    this.onOptionsEnabledChanged.emit(enabled);
  }

  private _optionsVisible(visible: boolean) {
    this.optionsVisible = visible;
  }

  private _orientation(orientation: Orientation) {
    this.orientation = orientation;
    this.onOrientationChanged.emit(orientation);
  }

  private _graphEnabled(enabled: boolean) {
    this.graphEnabled = enabled;
    this.onGraphEnabledChanged.emit(enabled);
  }

  private _graphVisible(visible: boolean) {
    this.graphVisible = visible;
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

  // private _slicesWindowCenterChanged(event: MouseEvent) {
  //   this.setSlicesWindowCenter((event.srcElement as any).value);
  // }

  // private _slicesWindowWidthChanged(event: MouseEvent) {
  //   this.setSlicesWindowWidth((event.srcElement as any).value);
  // }

  // private _volumeStepsChanged(event: MouseEvent) {
  //   this.setVolumeSteps((event.srcElement as any).value);
  // }

  // private _volumeWindowCenterChanged(event: MouseEvent) {
  //   this.setVolumeWindowCenter((event.srcElement as any).value);
  // }

  // private _volumeWindowWidthChanged(event: MouseEvent) {
  //   this.setVolumeWindowWidth((event.srcElement as any).value);
  // }

  renderDisplayModeToggle(): JSX.Element {
    if (this.displayMode !== DisplayMode.MESH) {
      return (
        <ion-item id="mode">
          <ion-icon name="eye" slot="start" />
          <select
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

  renderBoundingBoxEnabled(): JSX.Element {
    return (
      <ion-item>
        <ion-label>Bounding box</ion-label>
        <ion-toggle
          checked={this.boundingBoxVisible}
          onIonChange={e => this._boundingBoxVisible(e.detail.checked)}
        />
      </ion-item>
    );
  }

  renderOptions(): JSX.Element {
    if (this.optionsVisible && this.optionsEnabled) {
      switch (this.displayMode) {
        case DisplayMode.SLICES: {
          if (!this.stack) {
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
          (this
            .stackhelper as AMI.StackHelper).slice.windowCenter = windowCenter;

          return (
            <div>
              {this.renderBoundingBoxEnabled()}
              <ion-item>
                <ion-label>Index</ion-label>
                <ion-range
                  pin="true"
                  min="0"
                  max={indexMax}
                  value={index}
                  onIonChange={e => this._slicesIndex(e.detail.value)}
                />
              </ion-item>
              <ion-item>
                <ion-label>Orientation</ion-label>
                <select
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
                <ion-icon name="sunny" />
                <ion-range
                  pin="true"
                  min={windowCenterMin}
                  max={windowCenterMax}
                  value={windowCenter}
                  onIonChange={e => this._slicesWindowCenter(e.detail.value)}
                />
              </ion-item>
              <ion-item>
                <ion-icon name="contrast" />
                <ion-range
                  pin="true"
                  min={windowWidthMin}
                  max={windowWidthMax}
                  value={windowWidth}
                  onIonChange={e => this._slicesWindowWidth(e.detail.value)}
                />
              </ion-item>
            </div>
          );
        }

        /*
        case DisplayMode.VOLUME : {

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
          const windowWidthMax: number = this.stack.minMax[1] - this.stack.minMax[0];
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
          (this.stackHelper as AMI.VolumeRenderingHelper).uniforms.uSteps.value = steps;
          (this.stackHelper as AMI.VolumeRenderingHelper).windowWidth = windowWidth;
          (this.stackHelper as AMI.VolumeRenderingHelper).windowCenter = windowCenter;

          if (this.optionsVisible && this.optionsEnabled) {
            return (
              <div>
                { this.renderBoundingBoxEnabled() }
                <ion-item>
                  <ion-label>Steps</ion-label>
                  <ion-range min={stepsMin}
                    max={stepsMax}
                    value={steps}
                    pin="true"
                    onMouseUp={ this._volumeStepsChanged.bind(this) }></ion-range>
                </ion-item>
                <ion-item>
                  <ion-label>LUT</ion-label>
                  <select onChange={ (e) => this.onVolumeLutChanged.emit(e.detail.value) }>
                  {
                    this.luts.split(',').forEach((lut: string) => {
                      return <option value={lut}>{lut}</option>;
                    })
                  }
                  </ion-select>
                </ion-item>
                <ion-item>
                  <ion-icon name="sunny"></ion-icon>
                  <ion-range min={windowCenterMin}
                    max={windowCenterMax}
                    value={windowCenter}
                    pin="true"
                    onMouseUp={ this._volumeWindowCenterChanged.bind(this) }></ion-range>
                </ion-item>
                <ion-item>
                  <ion-icon name="contrast"></ion-icon>
                  <ion-range min={windowWidthMin}
                    max={windowWidthMax}
                    value={windowWidth}
                    pin="true"
                    onMouseUp={ this._volumeWindowWidthChanged.bind(this) }></ion-range>
                </ion-item>
              </div>
            )
          }
        }*/
        case DisplayMode.MESH: {
          return this.renderBoundingBoxEnabled();
        }
      }
    }

    return null;
  }

  render(): JSX.Element {
    return [
      this.renderDisplayModeToggle(),
      this.renderNodesToggle(),
      this.renderOptionsToggle(),
      this.renderOptions()
    ];
  }
}
