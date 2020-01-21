import { FunctionalComponent } from "../../stencil.core";
interface OrbitCameraProps extends FunctionalComponentProps {
    animating: boolean;
    controlPosition: string;
    controlTarget: string;
    dampingFactor: number;
    enabled: boolean;
    far: number;
    fov: number;
    maxPolarAngle: number;
    minDistance: number;
    minPolarAngle: number;
    near: number;
    panSpeed: number;
    rotateSpeed: number;
    zoomSpeed: number;
}
export declare const OrbitCamera: FunctionalComponent<OrbitCameraProps>;
export {};
