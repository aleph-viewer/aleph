import { EventEmitter } from "../../stencil.core";
import { AlEdge } from "../../interfaces";
export declare class AlEdgeEditor {
    private _contentStrings;
    deleteEdge: EventEmitter;
    saveEdge: EventEmitter;
    edge: [string, AlEdge];
    render(): any;
}
