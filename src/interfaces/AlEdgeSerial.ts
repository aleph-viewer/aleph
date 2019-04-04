import { AlGraphEntry } from "./AlGraphEntry";

export interface AlEdgeSerial extends AlGraphEntry {
  node1Id: string;
  node2Id: string;
}
