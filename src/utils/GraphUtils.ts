import { AlGraphEntry } from "../interfaces/AlGraphEntry";
import { AlGraphEntryType } from "../enums/AlGraphEntryType";

export class AlGraphEvents {
  static SELECTED: string = "al-graph-selected";
  static POINTER_OVER: string = "al-graph-pointer-over";
  static POINTER_OUT: string = "al-graph-pointer-out";
  static DRAGGING: string = "al-graph-dragging";
  static POINTER_DOWN: string = "al-graph-pointer-down";
  static POINTER_UP: string = "al-graph-pointer-up";
}

export class GraphUtils {
  static getEntryWithHighestId(entries: Map<string, AlGraphEntry>): number {
    if (entries.size) {
      return Math.max.apply(
        Math,
        [...entries].map(([id]) => {
          return Number(id.split("-")[1]);
        })
      );
    }

    return -1;
  }

  static getNextId(
    type: AlGraphEntryType,
    entries: Map<string, AlGraphEntry>
  ): string {
    return type + "-" + Number(this.getEntryWithHighestId(entries) + 1);
  }
}
