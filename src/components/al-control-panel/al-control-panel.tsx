import { Component, Prop } from "@stencil/core";
import { Tool } from "../../interfaces/interfaces";
import { DisplayMode } from "../../enums/DisplayMode";
import { ToolType } from "../../enums/ToolType";
import { Orientation } from "../../enums/Orientation";

@Component({
  tag: "al-control-panel",
  styleUrl: "al-control-panel.css",
  shadow: true
})
export class ControlPanel {
  @Prop() angleToolEnabled: boolean;
  @Prop() annotationToolEnabled: boolean;
  @Prop() boundingBoxVisible: boolean;
  @Prop() displayMode: DisplayMode;
  @Prop() optionsEnabled: boolean;
  @Prop() optionsVisible: boolean;
  @Prop() orientation: Orientation;
  @Prop() rulerToolEnabled: boolean;
  @Prop() selectedTool: number;
  @Prop() slicesIndex: number;
  @Prop() slicesWindowCenter: number;
  @Prop() slicesWindowWidth: number;
  @Prop() stack: any;
  @Prop() stackHelper: AMI.StackHelper;
  @Prop() tools: Tool[];
  @Prop() toolsEnabled: boolean;
  @Prop() toolsVisible: boolean;
  @Prop() toolType: ToolType;
  @Prop() volumeSteps: number;
  @Prop() volumeWindowCenter: number;
  @Prop() volumeWindowWidth: number;

  @Prop() addTool: (tool: Tool) => void;
  @Prop() removeTool: (id: number) => void;
  @Prop() saveTools: () => void;
  @Prop() selectTool: (id: number) => void;
  @Prop() setBoundingBoxVisible: (visible: boolean) => void;
  @Prop() setDisplayMode: (mode: DisplayMode) => void;
  @Prop() setOptionsEnabled: (enabled: boolean) => void;
  @Prop() setOrientation: (orientation: Orientation) => void;
  @Prop() setSlicesIndex: (index: number) => void;
  @Prop() setSlicesWindowCenter: (index: number) => void;
  @Prop() setSlicesWindowWidth: (index: number) => void;
  @Prop() setToolsEnabled: (enabled: boolean) => void;
  @Prop() setToolType: (toolType: ToolType) => void;
  @Prop() setVolumeSteps: (steps: number) => void;
  @Prop() setVolumeWindowCenter: (index: number) => void;
  @Prop() setVolumeWindowWidth: (index: number) => void;

  renderDisplayModeToggle(): JSX.Element {
    if (this.displayMode !== DisplayMode.MESH) {
      return (
        <ion-item id="mode">
          <ion-icon name="eye" />
          <select
            onChange={e =>
              this.setDisplayMode(e.srcElement.nodeValue as DisplayMode)
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

  renderToolsToggle(): JSX.Element {
    if (this.toolsVisible) {
      return (
        <ion-item>
          <ion-icon name="create" />
          <ion-toggle
            onIonChange={e => this.setToolsEnabled(e.detail.checked)}
          />
        </ion-item>
      );
    }

    return null;
  }

  renderTools(): JSX.Element {
    if (this.toolsVisible && this.toolsEnabled) {
      return [
        <ion-item>
          <ion-list lines="none">
            <ion-radio-group value={this.selectedTool}>
              {this.tools.map((tool: Tool) => {
                return (
                  <ion-item>
                    <ion-label>{tool.id}</ion-label>
                    <ion-radio
                      onClick={() => this.selectTool(tool.id)}
                      value={tool.id}
                    />
                  </ion-item>
                );
              })}
            </ion-radio-group>
          </ion-list>
        </ion-item>,
        <ion-footer>
          <ion-item>
            <ion-label>Tool Type</ion-label>
            <select
              onChange={e =>
                this.setToolType((e.target as HTMLSelectElement)
                  .value as ToolType)
              }
            >
              {this.angleToolEnabled ? (
                <option
                  selected={this.toolType === ToolType.ANGLE}
                  value={ToolType.ANGLE}
                >
                  Angle
                </option>
              ) : null}
              {this.annotationToolEnabled ? (
                <option
                  selected={this.toolType === ToolType.ANNOTATION}
                  value={ToolType.ANNOTATION}
                >
                  Annotation
                </option>
              ) : null}
              {this.rulerToolEnabled ? (
                <option
                  selected={this.toolType === ToolType.RULER}
                  value={ToolType.RULER}
                >
                  Ruler
                </option>
              ) : null}
            </select>
          </ion-item>
          <ion-toolbar>
            <ion-buttons>
              {/* <ion-button
                onClick={() => {
                  this.addTool(
                    CreateUtils.createTool(this.tools, this.toolType)
                  );
                }}
              >
                Add
              </ion-button> */}
              <ion-button
                onClick={() => {
                  this.saveTools();
                }}
              >
                Save
              </ion-button>
              {this.selectedTool !== null ? (
                <ion-button
                  onClick={() => {
                    this.removeTool(this.selectedTool);
                  }}
                >
                  Delete
                </ion-button>
              ) : null}
            </ion-buttons>
          </ion-toolbar>
        </ion-footer>
      ];
    }

    return null;
  }

  renderOptionsToggle(): JSX.Element {
    if (this.optionsVisible) {
      return (
        <ion-item>
          <ion-icon name="options" />
          <ion-toggle
            onIonChange={e => this.setOptionsEnabled(e.detail.checked)}
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
          onIonChange={e => this.setBoundingBoxVisible(e.detail.checked)}
        />
      </ion-item>
    );
  }

  renderOptions(): JSX.Element {
    switch (this.displayMode) {
      /*
      case DisplayMode.SLICES: {

        const orientationIndex: number = Object.keys(Orientation).indexOf(this.orientation.toUpperCase());

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
        const displayOrientationIndex = Math.round((orientationIndex + orientationOffset) % 3);
        const stackOrientationIndex = Math.round((orientationIndex + orientationOffset + 2) % 3);

        const indexMax: number = this.stack.dimensionsIJK[Object.keys(this.stack.dimensionsIJK)[stackOrientationIndex]] - 1;
        let index: number;

        if (this.slicesIndex === undefined) {
          // set default
          index = Math.floor(indexMax / 2);
        } else {
          index = this.slicesIndex;
        }

        const windowWidthMin: number = 1;
        const windowWidthMax: number = this.stack.minMax[1] - this.stack.minMax[0];
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
        (this.stackHelper as AMI.StackHelper).orientation = displayOrientationIndex;
        (this.stackHelper as AMI.StackHelper).index = index;
        (this.stackHelper as AMI.StackHelper).slice.windowWidth = windowWidth;
        (this.stackHelper as AMI.StackHelper).slice.windowCenter = windowCenter;

        if (this.optionsVisible && this.optionsEnabled) {
          return (
            <div>
              { this.renderBoundingBoxEnabled() }
              <ion-item>
                <ion-label>Index</ion-label>
                <ion-range pin="true" min="0" max={indexMax} value={index} onIonChange={ this._slicesIndexChanged.bind(this) }></ion-range>
              </ion-item>
              <ion-item>
              <ion-label>Orientation</ion-label>
                <select onChange={ (e) => this.setOrientation(e.detail.value) }>
                  <option selected={this.orientation === Orientation.CORONAL} value={Orientation.CORONAL}>Coronal (x)</option>
                  <option selected={this.orientation === Orientation.SAGGITAL} value={Orientation.SAGGITAL}>Saggital (y)</option>
                  <option selected={this.orientation === Orientation.AXIAL} value={Orientation.AXIAL}>Axial (z)</option>
                </select>
              </ion-item>
              <ion-item>
                <ion-icon name="sunny"></ion-icon>
                <ion-range pin="true"
                  min={windowCenterMin}
                  max={windowCenterMax}
                  value={windowCenter}
                  onIonChange={ this._slicesWindowCenterChanged.bind(this) }></ion-range>
              </ion-item>
              <ion-item>
                <ion-icon name="contrast"></ion-icon>
                <ion-range pin="true"
                  min={windowWidthMin}
                  max={windowWidthMax}
                  value={windowWidth}
                  onIonChange={ this._slicesWindowWidthChanged.bind(this) }></ion-range>
              </ion-item>
            </div>
          )
        } else {
          return null;
        }
      }
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
        if (this.optionsVisible && this.optionsEnabled) {
          return <div>{this.renderBoundingBoxEnabled()}</div>;
        }
      }
    }
  }

  // private _slicesIndexChanged(evt: MouseEvent) {
  //   this.setSlicesIndex((evt.srcElement as any).value);
  // }

  // private _slicesWindowCenterChanged(evt: MouseEvent) {
  //   this.setSlicesWindowCenter((evt.srcElement as any).value);
  // }

  // private _slicesWindowWidthChanged(evt: MouseEvent) {
  //   this.setSlicesWindowWidth((evt.srcElement as any).value);
  // }

  // private _volumeStepsChanged(evt: MouseEvent) {
  //   this.setVolumeSteps((evt.srcElement as any).value);
  // }

  // private _volumeWindowCenterChanged(evt: MouseEvent) {
  //   this.setVolumeWindowCenter((evt.srcElement as any).value);
  // }

  // private _volumeWindowWidthChanged(evt: MouseEvent) {
  //   this.setVolumeWindowWidth((evt.srcElement as any).value);
  // }

  render(): JSX.Element {
    return (
      <ion-app id="control-panel">
        {this.renderDisplayModeToggle()}
        {this.renderToolsToggle()}
        {this.renderTools()}
        {this.renderOptionsToggle()}
        {this.renderOptions()}
      </ion-app>
    );
  }
}
