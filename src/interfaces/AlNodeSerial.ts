import { AlGraphItem } from "./AlGraphItem";

export interface AlNodeSerial extends AlGraphItem {
  target?: string;
  position?: string;
  scale?: number;
  text?: string;
}
