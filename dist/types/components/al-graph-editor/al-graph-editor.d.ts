import { AlAngle, AlEdge, AlNode } from "../../interfaces";
export declare class AlGraphEditor {
    node: [string, AlNode];
    nodes: Map<string, AlNode> | null;
    angles: Map<string, AlAngle> | null;
    edges: Map<string, AlEdge> | null;
    selected: string | null;
    private _getSelectedNode;
    private _getSelectedEdge;
    private _getSelectedAngle;
    render(): any[];
}
