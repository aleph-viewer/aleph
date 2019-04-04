import { AlNodeSerial, AlEdgeSerial, AlAngleSerial } from "../interfaces";
import { AlGraphEntry } from "../interfaces/AlGraphEntry";
import { AlGraphEntryType } from "../enums/AlGraphEntryType";

export class AlGraphEvents {
  static SELECTED: string = "al-graph-selected";
  static INTERSECTION: string = "al-graph-intersection";
  static INTERSECTION_CLEARED: string = "al-graph-intersection-cleared";
  static DRAGGING: string = "al-graph-dragging";
  static CONTROLS_ENABLED: string = "al-graph-controls-enabled";
  static CONTROLS_DISABLED: string = "al-graph-controls-disabled";
}

export class GraphUtils {
  static getMapEntryWithHighestId(entries: Map<string, AlGraphEntry>): number {
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
    return type + "-" + Number(this.getMapEntryWithHighestId(entries) + 1);
  }
}
