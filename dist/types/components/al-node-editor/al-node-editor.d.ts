import { EventEmitter } from "../../stencil.core";
import { AlNode } from "../../interfaces";
export declare class AlNodeEditor {
    private _contentStrings;
    deleteNode: EventEmitter;
    saveNode: EventEmitter;
    node: [string, AlNode];
    render(): any;
}
