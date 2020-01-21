export class AlGraphEvents {
}
AlGraphEvents.SELECTED = "al-graph-selected";
AlGraphEvents.POINTER_OVER = "al-graph-pointer-over";
AlGraphEvents.POINTER_OUT = "al-graph-pointer-out";
AlGraphEvents.DRAGGED = "al-graph-dragged";
AlGraphEvents.POINTER_DOWN = "al-graph-pointer-down";
AlGraphEvents.POINTER_UP = "al-graph-pointer-up";
// tslint:disable-next-line: max-classes-per-file
export class GraphUtils {
    static getEntryWithHighestId(entries) {
        if (entries.size) {
            return Math.max.apply(Math, Array.from(entries).map(([id]) => {
                return Number(id.split("-")[1]);
            }));
        }
        return -1;
    }
    static getNextId(type, entries) {
        return type + "-" + Number(this.getEntryWithHighestId(entries) + 1);
    }
}
