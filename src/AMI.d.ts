// todo: is there an AMI definition file?
declare namespace AMI {
  class VolumeLoader {
    constructor(...params);
    data: any[];
    free();
    load(files: string[]): Promise<void>;
  }
  class StackHelper {
    constructor(stack: any, isWebgl2: boolean);
    bbox: any;
    border: any;
    stack: any;
    slice: any;
    index: any;
    orientation: any;
    hasUniforms(): any;
  }
  class VolumeRenderHelper {
    constructor(stack: any, isWebgl2: boolean);
    stack: any;
    windowWidth: number;
    steps: number;
    windowCenter: number;
    children: any;
    textureLUT: THREE.Texture;
    hasUniforms(): any;
  }
  class VolumeRenderHelper2 {
    constructor(stack: any, isWebgl2: boolean);
    stack: any;
    windowWidth: number;
    windowCenter: number;
    children: any;
    textureLUT: THREE.Texture;
    hasUniforms(): any;
  }
  class LutHelper {
    constructor(el: any);
    luts: any;
    lutsO: any;
    texture: any;
    static presetLuts(): () => void;
    static presetLutsO(): () => void;
    lutsAvailable(): string[];
  }
  class CoreUtils {
    constructor(...params);
    static getPixelData(...params): any;
    static worldToData(...params): THREE.Vector3;
    static rescaleSlopeIntercept(...params): any;
  }
}
