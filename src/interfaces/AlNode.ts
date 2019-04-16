import { AlGraphEntry } from "./AlGraphEntry";

export interface AlNode extends AlGraphEntry {
  target?: string;
  position?: string;
  scale?: number;
  text?: string;
}
