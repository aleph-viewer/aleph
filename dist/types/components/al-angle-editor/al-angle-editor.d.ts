import { EventEmitter } from "../../stencil.core";
import { AlAngle } from "../../interfaces";
export declare class AlAngleEditor {
    private _contentStrings;
    deleteAngle: EventEmitter;
    saveAngle: EventEmitter;
    angle: [string, AlAngle];
    render(): any;
}
