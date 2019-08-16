import { AlAngle, AlCamera, AlEdge, AlNode } from ".";
import { ControlsType } from "../enums/ControlsType";
import { DisplayMode, Orientation } from "../enums";
import { Material } from "../enums/Material";
import { Units } from "../enums/Units";

export interface AlAppState {
  angles: Map<string, AlAngle>;
  boundingBoxEnabled: boolean;
  camera: AlCamera;
  controlsEnabled: boolean;
  controlsType: ControlsType;
  displayMode: DisplayMode;
  edges: Map<string, AlEdge>;
  graphEnabled: boolean;
  material: Material;
  nodes: Map<string, AlNode>;
  orientation: Orientation;
  selected: string | null;
  slicesIndex: number;
  slicesWindowCenter: number;
  slicesWindowWidth: number;
  src: string | null;
  srcLoaded: boolean;
  units: Units;
  volumeSteps: number;
  volumeWindowCenter: number;
  volumeWindowWidth: number;
}
