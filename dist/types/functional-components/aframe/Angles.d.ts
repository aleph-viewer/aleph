import { FunctionalComponent } from "../../stencil.core";
import { ControlsType } from "../../enums";
import { AlAngle, AlEdge, AlNode } from "../../interfaces";
interface AnglesProps extends FunctionalComponentProps {
    angles: Map<string, AlAngle>;
    boundingSphereRadius: number;
    camera: THREE.Camera;
    cameraPosition: THREE.Vector3;
    controlsType: ControlsType;
    edges: Map<string, AlEdge>;
    edgeSize: number;
    fontSize: number;
    nodes: Map<string, AlNode>;
    selected: string;
}
export declare const Angles: FunctionalComponent<AnglesProps>;
export {};
