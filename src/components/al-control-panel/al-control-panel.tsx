import {
  Component,
  Prop,
  Event,
  EventEmitter,
  Watch,
  State
} from "@stencil/core";
import { AlToolSerial } from "../../interfaces";
import { DisplayMode } from "../../enums/DisplayMode";
import { Orientation } from "../../enums/Orientation";

@Component({
  tag: "al-control-panel",
  styleUrl: "al-control-panel.css",
  shadow: false
})
export class ControlPanel {
  //@Event() onAddTool: EventEmitter;
  @Event() onRemoveTool: EventEmitter;
  @Event() onSetBoundingBoxVisible: EventEmitter;
  @Event() onSetDisplayMode: EventEmitter;
  @Event() onSetOptionsEnabled: EventEmitter;
  @Event() onSetOrientation: EventEmitter;
  @Event() onSetSlicesIndex: EventEmitter;
  @Event() onSetSlicesWindowCenter: EventEmitter;
  @Event() onSetSlicesWindowWidth: EventEmitter;
  @Event() onSetToolsEnabled: EventEmitter;
  @Event() onSetVolumeSteps: EventEmitter;
  @Event() onSetVolumeWindowCenter: EventEmitter;
  @Event() onSetVolumeWindowWidth: EventEmitter;

  @State() _boundingBoxVisible: boolean;
  @Prop({ mutable: true }) boundingBoxVisible: boolean = false;
  @Watch("boundingBoxVisible")
  boundingBoxVisibleWatcher(newValue: boolean) {
    this._boundingBoxVisible = newValue;
    this.onSetBoundingBoxVisible.emit(newValue);
  }

  @State() _displayMode: DisplayMode;
  @Prop({ mutable: true }) displayMode: DisplayMode = DisplayMode.MESH;
  @Watch("displayMode")
  displayModeWatcher(newValue: DisplayMode) {
    this._displayMode = newValue;
    this.onSetDisplayMode.emit(newValue);
  }

  @State() _optionsEnabled: boolean;
  @Prop({ mutable: true }) optionsEnabled: boolean = false;
  @Watch("displayMode")
  optionsEnabledWatcher(newValue: boolean) {
    this._optionsEnabled = newValue;
    this.onSetOptionsEnabled.emit(newValue);
  }

  @State() _orientation: Orientation;
  @Prop({ mutable: true }) orientation: Orientation = Orientation.CORONAL;
  @Watch("orientation")
  orientationWatcher(newValue: Orientation) {
    this._orientation = newValue;
    this.onSetOrientation.emit(newValue);
  }

  @State() _slicesIndex: number;
  @Prop({ mutable: true }) slicesIndex: number;
  @Watch("slicesIndex")
  slicesIndexWatcher(newValue: number) {
    this._slicesIndex = newValue;
    this.onSetSlicesIndex.emit(newValue);
  }

  @State() _slicesWindowCenter: number;
  @Prop({ mutable: true }) slicesWindowCenter: number;
  @Watch("slicesWindowCenter")
  slicesWindowCenterWatcher(newValue: number) {
    this._slicesWindowCenter = newValue;
    this.onSetSlicesWindowCenter.emit(newValue);
  }

  @State() _slicesWindowWidth: number;
  @Prop({ mutable: true }) slicesWindowWidth: number;
  @Watch("slicesWindowWidth")
  slicesWindowWidthWatcher(newValue: number) {
    this._slicesWindowWidth = newValue;
    this.onSetSlicesWindowWidth.emit(newValue);
  }

  @State() _toolsEnabled: boolean;
  @Prop({ mutable: true }) toolsEnabled: boolean = false;
  @Watch("toolsEnabled")
  toolsEnabledWatcher(newValue: boolean) {
    this._toolsEnabled = newValue;
    this.onSetToolsEnabled.emit(newValue);
  }

  @State() _optionsVisible: boolean;
  @Prop() optionsVisible: boolean = true;
  @Watch("optionsVisible")
  optionsVisibleWatcher(newValue: boolean) {
    this._optionsVisible = newValue;
  }

  @State() _selectedTool: string | null;
  @Prop() selectedTool: string | null = null;
  @Watch("selectedTool")
  selectedToolWatcher(newValue: string | null) {
    this._selectedTool = newValue;
  }

  @State() _stack: any;
  @Prop() stack: any;
  @Watch("stack")
  stackWatcher(newValue: any) {
    this._stack = newValue;
  }

  @State() _stackHelper: AMI.StackHelper;
  @Prop() stackHelper: AMI.StackHelper;
  @Watch("stackHelper")
  stackHelperWatcher(newValue: AMI.StackHelper) {
    this._stackHelper = newValue;
  }

  @State() _tools: AlToolSerial[];
  @Prop() tools: AlToolSerial[] = [];
  @Watch("tools")
  toolsWatcher(newValue: AlToolSerial[]) {
    this._tools = newValue;
  }

  @State() _toolsVisible: boolean;
  @Prop() toolsVisible: boolean = true;
  @Watch("toolsVisible")
  toolsVisibleWatcher(newValue: boolean) {
    this._toolsVisible = newValue;
  }

  @State() _volumeSteps: number;
  @Prop() volumeSteps: number;
  @Watch("volumeSteps")
  volumeStepsWatcher(newValue: number) {
    this._volumeSteps = newValue;
    this.onSetVolumeSteps.emit(newValue);
  }

  @State() _volumeWindowCenter: number;
  @Prop() volumeWindowCenter: number;
  @Watch("volumeWindowCenter")
  volumeWindowCenterWatcher(newValue: number) {
    this._volumeWindowCenter = newValue;
    this.onSetVolumeWindowCenter.emit(newValue);
  }

  @State() _volumeWindowWidth: number;
  @Prop() volumeWindowWidth: number;
  @Watch("volumeWindowWidth")
  volumeWindowWidthWatcher(newValue: number) {
    this._volumeWindowWidth = newValue;
    this.onSetVolumeWindowWidth.emit(newValue);
  }

  renderDisplayModeToggle(): JSX.Element {
    if (this.displayMode !== DisplayMode.MESH) {
      return (
        <ion-item id="mode">
          <ion-icon name="eye" />
          <select
            onChange={e =>
              (this.displayMode = e.srcElement.nodeValue as DisplayMode)
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
            onIonChange={e => (this.toolsEnabled = e.detail.checked)}
          />
        </ion-item>
      );
    }

    return null;
  }

  renderTools(): JSX.Element {
    if (this.toolsVisible && this.toolsEnabled) {
      return [
        // <div class="al-list">
        //   {this.tools.map((tool: Tool) => {
        //     return (
        //       <label class="block">
        //         <input
        //           type="radio"
        //           checked={this.selectedTool === tool.id}
        //           id={tool.id}
        //           name="tool"
        //           value={tool.id}
        //           onChange={e => this.selectTool(e.srcElement.id)}
        //         />
        //         {tool.id}
        //       </label>
        //     );
        //   })}
        // </div>,
        <ion-footer>
          {/* <ion-item>
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
          </ion-item> */}
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
              {/* <ion-button
                onClick={() => {
                  this.saveTools();
                }}
              >
                Save
              </ion-button> */}
              {this.selectedTool !== null ? (
                <ion-button
                  onClick={() => {
                    this.onRemoveTool.emit(this.selectedTool);
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
            onIonChange={e => this.onSetOptionsEnabled.emit(e.detail.checked)}
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
          onIonChange={e => (this.boundingBoxVisible = e.detail.checked)}
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
      <div id="al-control-panel-wrapper">
        <ion-app>
          {this.renderDisplayModeToggle()}
          {this.renderToolsToggle()}
          {this.renderTools()}
          {this.renderOptionsToggle()}
          {this.renderOptions()}
        </ion-app>
      </div>
    );
  }
}
