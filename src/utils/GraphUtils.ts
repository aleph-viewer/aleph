import { AlGraphEntryType } from "../enums";
import { AlGraphEntry } from "../interfaces";

export class AlGraphEvents {
  public static SELECTED: string = "al-graph-selected";
  public static POINTER_OVER: string = "al-graph-pointer-over";
  public static POINTER_OUT: string = "al-graph-pointer-out";
  public static DRAGGED: string = "al-graph-dragged";
  public static POINTER_DOWN: string = "al-graph-pointer-down";
  public static POINTER_UP: string = "al-graph-pointer-up";
}

// tslint:disable-next-line: max-classes-per-file
export class GraphUtils {
  public static getEntryWithHighestId(
    entries: Map<string, AlGraphEntry>
  ): number {
    if (entries.size) {
      return Math.max.apply(
        Math,
        Array.from(entries).map(([id]) => {
          return Number(id.split(" ")[1]);
        })
      );
    }

    return 0;
  }

  public static getNextId(
    type: AlGraphEntryType,
    entries: Map<string, AlGraphEntry>
  ): string {
    return type.charAt(0).toUpperCase() + type.slice(1) + " " + Number(this.getEntryWithHighestId(entries) + 1);
  }
}
