import {
  Component,
  Prop,
  Event,
  EventEmitter,
  Watch,
  State
} from "@stencil/core";
import { AlNodeSerial } from "../../interfaces";
import { DisplayMode } from "../../enums/DisplayMode";
import { Orientation } from "../../enums/Orientation";

@Component({
  tag: "al-control-panel",
  styleUrl: "al-control-panel.css",
  shadow: false
})
export class AlControlPanel {
  @Event() onSetBoundingBoxVisible: EventEmitter;
  @Event() onSetDisplayMode: EventEmitter;
  @Event() onSetOptionsEnabled: EventEmitter;
  @Event() onSetOrientation: EventEmitter;
  @Event() onSetSlicesIndex: EventEmitter;
  @Event() onSetSlicesWindowCenter: EventEmitter;
  @Event() onSetSlicesWindowWidth: EventEmitter;
  @Event() onSetNodesEnabled: EventEmitter;
  @Event() onSetVolumeSteps: EventEmitter;
  @Event() onSetVolumeWindowCenter: EventEmitter;
  @Event() onSetVolumeWindowWidth: EventEmitter;

  @Prop({ mutable: true }) boundingBoxVisible: boolean = false;
  @Prop({ mutable: true }) displayMode: DisplayMode = DisplayMode.MESH;
  @Prop({ mutable: true }) optionsEnabled: boolean = false;
  @Prop({ mutable: true }) optionsVisible: boolean = true;
  @Prop({ mutable: true }) orientation: Orientation = Orientation.CORONAL;
  @Prop({ mutable: true }) selected: string | null = null;
  @Prop({ mutable: true }) slicesIndex: number;
  @Prop({ mutable: true }) slicesWindowCenter: number;
  @Prop({ mutable: true }) slicesWindowWidth: number;
  @Prop({ mutable: true }) stack: any;
  @Prop({ mutable: true }) stackHelper: AMI.StackHelper;
  @Prop({ mutable: true }) nodes: Map<string, AlNodeSerial> = new Map<
    string,
    AlNodeSerial
  >();
  @Prop({ mutable: true }) nodesEnabled: boolean = false;
  @Prop({ mutable: true }) nodesVisible: boolean = true;
  @Prop({ mutable: true }) volumeSteps: number;
  @Prop({ mutable: true }) volumeWindowCenter: number;
  @Prop({ mutable: true }) volumeWindowWidth: number;

  private _boundingBoxVisible(visible: boolean) {
    this.boundingBoxVisible = visible;
    this.onSetBoundingBoxVisible.emit(visible);
  }

  private _displayMode(displayMode: DisplayMode) {
    this.displayMode = displayMode;
    this.onSetDisplayMode.emit(displayMode);
  }

  private _optionsEnabled(enabled: boolean) {
    this.optionsEnabled = enabled;
    this.onSetOptionsEnabled.emit(enabled);
  }

  private _optionsVisible(visible: boolean) {
    this.optionsVisible = visible;
  }

  private _orientation(orientation: Orientation) {
    this.orientation = orientation;
    this.onSetOrientation.emit(orientation);
  }

  private _selected(nodeId: string | null) {
    this.selected = nodeId;
  }

  private _slicesIndex(index: number) {
    this.slicesIndex = index;
    this.onSetSlicesIndex.emit(index);
  }

  private _slicesWindowCenter(center: number) {
    this.slicesWindowCenter = center;
    this.onSetSlicesWindowCenter.emit(center);
  }

  private _slicesWindowWidth(width: number) {
    this.slicesWindowWidth = width;
    this.onSetSlicesWindowWidth.emit(width);
  }

  private _stack(stack: any) {
    this._stack = stack;
  }

  private _stackHelper(helper: AMI.StackHelper) {
    this.stackHelper = helper;
  }

  private _nodes(nodes: Map<string, AlNodeSerial>) {
    this.nodes = nodes;
  }

  private _nodesEnabled(enabled: boolean) {
    this.nodesEnabled = enabled;
    this.onSetNodesEnabled.emit(enabled);
  }

  private _nodesVisible(vislbe: boolean) {
    this.nodesVisible = vislbe;
  }

  private _volumeSteps(steps: number) {
    this.volumeSteps = steps;
    this.onSetVolumeSteps.emit(steps);
  }

  private _volumeWindowCenter(center: number) {
    this.volumeWindowCenter = center;
    this.onSetVolumeWindowCenter.emit(center);
  }

  private _volumeWindowWidth(width: number) {
    this.volumeWindowWidth = width;
    this.onSetVolumeWindowWidth.emit(width);
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

  renderNodesToggle(): JSX.Element {
    if (this.nodesVisible) {
      return (
        <ion-item>
          <ion-icon name="create" />
          <ion-toggle onIonChange={e => this._nodesEnabled(e.detail.checked)} />
        </ion-item>
      );
    }

    return null;
  }

  renderNodes(): JSX.Element {
    //if (this.nodesVisible && this.nodesEnabled) {
    //return [
    // <div class="al-list">
    //   {this.nodes.map((node: Node) => {
    //     return (
    //       <label class="block">
    //         <input
    //           type="radio"
    //           checked={this.selected === node.id}
    //           id={node.id}
    //           name="node"
    //           value={node.id}
    //           onChange={e => this.selectNode(e.srcElement.id)}
    //         />
    //         {node.id}
    //       </label>
    //     );
    //   })}
    // </div>,
    // <ion-footer>
    {
      /* <ion-item>
            <ion-label>Node Type</ion-label>
            <select
              onChange={e =>
                this.setNodeType((e.target as HTMLSelectElement)
                  .value as NodeType)
              }
            >
              {this.angleNodeEnabled ? (
                <option
                  selected={this.nodeType === NodeType.ANGLE}
                  value={NodeType.ANGLE}
                >
                  Angle
                </option>
              ) : null}
              {this.annotationNodeEnabled ? (
                <option
                  selected={this.nodeType === NodeType.ANNOTATION}
                  value={NodeType.ANNOTATION}
                >
                  Annotation
                </option>
              ) : null}
              {this.rulerNodeEnabled ? (
                <option
                  selected={this.nodeType === NodeType.RULER}
                  value={NodeType.RULER}
                >
                  Ruler
                </option>
              ) : null}
            </select>
          </ion-item> */
    }
    // <ion-nodebar>
    //   <ion-buttons>
    {
      /* <ion-button
                onClick={() => {
                  this.addNode(
                    CreateUtils.createNode(this.nodes, this.nodeType)
                  );
                }}
              >
                Add
              </ion-button> */
    }
    {
      /* <ion-button
                onClick={() => {
                  this.saveNodes();
                }}
              >
                Save
              </ion-button> */
    }
    {
      /* {this.selected !== null ? (
                <ion-button
                  onClick={() => {
                    this.onRemoveNode.emit(this.selected);
                  }}
                >
                  Delete
                </ion-button>
              ) : null} */
    }
    //     </ion-buttons>
    //   </ion-nodebar>
    // </ion-footer>
    //];
    //}

    return null;
  }

  renderOptionsToggle(): JSX.Element {
    if (this.optionsVisible) {
      return (
        <ion-item>
          <ion-icon name="options" />
          <ion-toggle
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

  // private _slicesIndexChanged(event: MouseEvent) {
  //   this.setSlicesIndex((event.srcElement as any).value);
  // }

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

  render(): JSX.Element {
    return [
      this.renderDisplayModeToggle(),
      this.renderNodesToggle(),
      this.renderNodes(),
      this.renderOptionsToggle(),
      this.renderOptions()
    ];
  }
}
