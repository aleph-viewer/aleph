import { AlGraphEntryType } from "../enums";
import { AlGraphEntry } from "../interfaces";
export declare class AlGraphEvents {
    static SELECTED: string;
    static POINTER_OVER: string;
    static POINTER_OUT: string;
    static DRAGGED: string;
    static POINTER_DOWN: string;
    static POINTER_UP: string;
}
export declare class GraphUtils {
    static getEntryWithHighestId(entries: Map<string, AlGraphEntry>): number;
    static getNextId(type: AlGraphEntryType, entries: Map<string, AlGraphEntry>): string;
}
