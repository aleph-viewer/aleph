import { AlAngle, AlCamera, AlEdge, AlNode } from ".";
import { DisplayMode, Orientation } from "../enums";

export interface AlAppState {
  angles: Map<string, AlAngle>;
  boundingBoxEnabled: boolean;
  camera: AlCamera;
  controlsEnabled: boolean;
  displayMode: DisplayMode;
  edges: Map<string, AlEdge>;
  graphEnabled: boolean;
  nodes: Map<string, AlNode>;
  orientation: Orientation;
  selected: string | null;
  slicesIndex: number;
  slicesWindowCenter: number;
  slicesWindowWidth: number;
  src: string | null;
  srcLoaded: boolean;
  volumeSteps: number;
  volumeWindowCenter: number;
  volumeWindowWidth: number;
}
