import { EventEmitter } from "../../stencil.core";
export declare class AlUrlPicker {
    urlChanged: EventEmitter;
    urls: Map<string, string> | null;
    url: string | null;
    private _input;
    render(): any;
}
