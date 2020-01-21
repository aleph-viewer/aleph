import { FunctionalComponent } from "../../stencil.core";
import { ControlsType } from "../../enums";
import { AlNode } from "../../interfaces";
interface NodesProps extends FunctionalComponentProps {
    boundingSphereRadius: number;
    camera: THREE.Camera;
    cameraPosition: THREE.Vector3;
    controlsType: ControlsType;
    fontSize: number;
    graphEnabled: boolean;
    nodes: Map<string, AlNode>;
    selected: string;
}
export declare const Nodes: FunctionalComponent<NodesProps>;
export {};
