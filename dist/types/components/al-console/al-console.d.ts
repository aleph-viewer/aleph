import { EventEmitter } from "../../stencil.core";
export declare class AlConsole {
    private _contentStrings;
    private _graph;
    graphSubmitted: EventEmitter;
    graph: string | null;
    tabSize: number;
    private _getGraphJson;
    render(): any;
}
