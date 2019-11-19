import { FunctionalComponent } from "../../stencil.core";
import { ControlsType, DisplayMode, Units } from "../../enums";
import { AlEdge, AlNode } from "../../interfaces";
interface EdgesProps extends FunctionalComponentProps {
    boundingSphereRadius: number;
    camera: THREE.Camera;
    cameraPosition: THREE.Vector3;
    controlsType: ControlsType;
    displayMode: DisplayMode;
    edges: Map<string, AlEdge>;
    edgeSize: number;
    fontSize: number;
    nodes: Map<string, AlNode>;
    selected: string;
    units: Units;
}
export declare const Edges: FunctionalComponent<EdgesProps>;
export {};
