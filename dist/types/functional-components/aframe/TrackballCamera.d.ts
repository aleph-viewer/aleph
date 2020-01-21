import { FunctionalComponent } from "../../stencil.core";
interface TrackballCameraProps extends FunctionalComponentProps {
    animating: boolean;
    controlPosition: string;
    controlTarget: string;
    dampingFactor: number;
    enabled: boolean;
    far: number;
    fov: number;
    near: number;
    panSpeed: number;
    rotateSpeed: number;
    screenHeight: number;
    screenWidth: number;
    zoomSpeed: number;
}
export declare const TrackballCamera: FunctionalComponent<TrackballCameraProps>;
export {};
