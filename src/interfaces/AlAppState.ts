import { DisplayMode, Orientation } from "../enums";
import { AlNodeSerial } from ".";

export interface AlAppState {
  boundingBoxVisible: boolean;
  displayMode: DisplayMode;
  optionsEnabled: boolean;
  orientation: Orientation;
  selectedNode: string | null;
  slicesIndex: number;
  slicesWindowCenter: number;
  slicesWindowWidth: number;
  src: string | null;
  srcLoaded: boolean;
  nodes: Map<string, AlNodeSerial>;
  nodesEnabled: boolean;
  volumeSteps: number;
  volumeWindowCenter: number;
  volumeWindowWidth: number;
  cameraAnimating: boolean;
}
