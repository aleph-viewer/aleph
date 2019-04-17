// todo: is there an AMI definition file?
declare namespace AMI {
  class VolumeLoader {
    constructor(...params);
    data: any[];
    free();
    load(files: string[]): Promise<void>;
  }
  class StackHelper {
    constructor(...params);
    bbox: any;
    border: any;
    stack: any;
    slice: any;
    index: any;
    orientation: any;
  }
  class VolumeRenderHelper {
    constructor(...params);
    uniforms: any;
    stack: any;
    windowWidth: any;
    windowCenter: any;
    orientationMaxIndex: any;
    children: any;
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
