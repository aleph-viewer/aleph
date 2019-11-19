// todo: is there an AMI definition file?
declare namespace AMI {
  class VolumeLoader {
    constructor(...params);
    data: any[];
    free();
    load(files: string[]): Promise<void>;
  }
  class StackHelper {
    constructor(stack: any);
    bbox: any;
    border: any;
    stack: any;
    slice: any;
    index: any;
    orientation: any;
    hasUniforms(): any;
  }
  class VolumeRenderHelper {
    constructor(stack: any);
    stack: any;
    windowWidth: number;
    steps: number;
    windowCenter: number;
    children: any;
    textureLUT: THREE.Texture;
    geometry: THREE.BoxGeometry;
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
