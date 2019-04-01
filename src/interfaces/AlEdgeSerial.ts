import { AlGraphItem } from "./AlGraphItem";

export interface AlEdgeSerial extends AlGraphItem {
  node1Id: string;
  node2Id: string;
}
