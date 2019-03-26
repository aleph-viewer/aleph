import { Tool } from "./Tool";
import { DisplayMode, Orientation } from "../enums";

export interface AlAppState {
  src: string | null;
  srcLoaded: boolean;
  tools: Tool[];
  selectedTool: string | null;
  displayMode: DisplayMode;
  orientation: Orientation;
  toolsEnabled: boolean;
  optionsEnabled: boolean;
  boundingBoxVisible: boolean;
  slicesIndex: number;
  slicesWindowWidth: number;
  slicesWindowCenter: number;
  volumeSteps: number;
  volumeWindowWidth: number;
  volumeWindowCenter: number;
  angleToolEnabled: boolean;
  annotationToolEnabled: boolean;
  rulerToolEnabled: boolean;
}
