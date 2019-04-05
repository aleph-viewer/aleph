import { DisplayMode, Orientation } from "../enums";
import { AlNodeSerial, AlAngleSerial, AlEdgeSerial, AlCameraSerial } from ".";

export interface AlAppState {
  angles: Map<string, AlAngleSerial>;
  boundingBoxVisible: boolean;
  camera: AlCameraSerial;
  controlsEnabled: boolean;
  displayMode: DisplayMode;
  edges: Map<string, AlEdgeSerial>;
  graphEnabled: boolean;
  nodes: Map<string, AlNodeSerial>;
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
