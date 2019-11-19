import { FunctionalComponent } from "../../stencil.core";
import { DisplayMode } from "../../enums";
declare type Entity = import("aframe").Entity;
interface BoundingBoxProps extends FunctionalComponentProps {
    boundingBox: THREE.Box3;
    boundingBoxEnabled: boolean;
    color: string;
    displayMode: DisplayMode;
    graphEnabled: boolean;
    mesh: THREE.Mesh;
    srcLoaded: boolean;
    targetEntity: Entity;
}
export declare const BoundingBox: FunctionalComponent<BoundingBoxProps>;
export {};
