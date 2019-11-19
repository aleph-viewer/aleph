import { AlGraphEntry } from "./AlGraphEntry";
export interface AlEdge extends AlGraphEntry {
    node1Id: string;
    node2Id: string;
}
