import { AlGraphEntry } from "./AlGraphEntry";

export interface AlNode extends AlGraphEntry {
  position?: string;
  scale?: number;
  targetId?: string;
}
