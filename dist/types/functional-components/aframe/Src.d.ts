import { FunctionalComponent } from "../../stencil.core";
import { ControlsType, DisplayMode, Orientation } from "../../enums";
interface SrcProps extends FunctionalComponentProps {
    controlsType: ControlsType;
    displayMode: DisplayMode;
    dracoDecoderPath: string;
    graphEnabled: boolean;
    orientation: Orientation;
    slicesIndex: number;
    src: string;
    srcLoaded: boolean;
    volumeSteps: number;
    volumeWindowCenter: number;
    volumeWindowWidth: number;
}
export declare const Src: FunctionalComponent<SrcProps>;
export {};
