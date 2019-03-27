import { AlToolSerial } from "./index";
import { DisplayMode, Orientation } from "../enums";

export interface AlAppState {
  boundingBoxVisible: boolean;
  displayMode: DisplayMode;
  optionsEnabled: boolean;
  orientation: Orientation;
  selectedTool: string | null;
  slicesIndex: number;
  slicesWindowCenter: number;
  slicesWindowWidth: number;
  src: string | null;
  srcLoaded: boolean;
  tools: AlToolSerial[];
  toolsEnabled: boolean;
  volumeSteps: number;
  volumeWindowCenter: number;
  volumeWindowWidth: number;
}
