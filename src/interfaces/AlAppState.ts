import { AlNodeSerial } from "./index";
import { DisplayMode, Orientation } from "../enums";

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
  nodes: AlNodeSerial[];
  nodesEnabled: boolean;
  volumeSteps: number;
  volumeWindowCenter: number;
  volumeWindowWidth: number;
  cameraAnimating: boolean;
}
