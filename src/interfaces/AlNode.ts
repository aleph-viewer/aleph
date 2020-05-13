import { AlGraphEntry } from "./AlGraphEntry";

export interface AlNode extends AlGraphEntry {
  normal?: string;
  position?: string;
  scale?: number;
  targetId?: string;
}
