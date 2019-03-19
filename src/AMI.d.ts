
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
  class AngleWidget {
    constructor(...params);
    worldPosition: any;
  }
  class AnnotationWidget {
    constructor(...params);
    worldPosition: any;
  }
  class RulerWidget {
    constructor(...params);
    lps2IJK: any;
    pixelSpacing: any;
    ultrasoundRegions: any;
    worldPosition: any;
  }
  class VolumeRenderingHelper {
    constructor(...params);
    uniforms: any;
    stack: any;
    windowWidth: any;
    windowCenter: any;
    orientationMaxIndex: any;
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
  class UtilsCore {
    constructor(...params);
    static getPixelData(...params): any;
    static worldToData(...params): THREE.Vector3;
    static rescaleSlopeIntercept(...params): any;
  }
  class  WidgetsCss {
    constructor(...params);
    static code: any;
  }
  class IntersectionsCore {
    constructor(...params);
    static rayPlane(...params): THREE.Vector3;
    static sub(...params): () => any;
  }

  class TrackballControl {
    constructor(camera: any, el: HTMLElement);
    target: any;
    update: any;
    rotateSpeed: number;
    zoomSpeed: number;
    panSpeed: number;
    staticMoving: boolean;
    dynamicDampingFactor: number;
    addEventListener: any;
    object: any;
    enabled: boolean;
    domElement: any;
  }

}
