import { AlGraphEntry } from "./AlGraphEntry";

export interface AlNodeSerial extends AlGraphEntry {
  target?: string;
  position?: string;
  scale?: number;
  text?: string;
}
