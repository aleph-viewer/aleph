import { EventEmitter } from "../../stencil.core";
import { AlNode } from "../../interfaces";
export declare class AlNodeList {
    private _contentStrings;
    selectedChanged: EventEmitter;
    nodes: Map<string, AlNode> | null;
    selected: string | null;
    render(): any;
}
