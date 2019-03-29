import { DisplayMode, Orientation } from "../enums";
import { AlNodeSerial, AlAngleSerial, AlEdgeSerial, AlCameraSerial } from ".";

export interface AlAppState {
  angles: Map<string, AlAngleSerial>;
  boundingBoxVisible: boolean;
  camera: AlCameraSerial;
  cameraAnimating: boolean;
  controlsEnabled: boolean;
  displayMode: DisplayMode;
  edges: Map<string, AlEdgeSerial>;
  nodes: Map<string, AlNodeSerial>;
  nodesEnabled: boolean;
  orientation: Orientation;
  selectedAngle: string | null;
  selectedEdge: string | null;
  selectedNode: string | null;
  slicesIndex: number;
  slicesWindowCenter: number;
  slicesWindowWidth: number;
  src: string | null;
  srcLoaded: boolean;
  volumeSteps: number;
  volumeWindowCenter: number;
  volumeWindowWidth: number;
}
