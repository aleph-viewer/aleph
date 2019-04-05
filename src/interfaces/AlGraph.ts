import { AlNodeSerial, AlEdgeSerial, AlAngleSerial } from ".";

export interface AlGraph {
  nodes: Map<string, AlNodeSerial>;
  edges: Map<string, AlEdgeSerial>;
  angles: Map<string, AlAngleSerial>;
}
