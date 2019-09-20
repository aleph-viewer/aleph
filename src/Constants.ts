export class Constants {
  public static lightIntensity = 0.5;
  public static BoundingBoxWidth = 2;
  // 24 FPS
  public static targetFrameTime = 1000 / 24;
  public static stepPowerMinMax = [1, 10];
  public static movingStepCount = 2;
  public static controllerName = "-controller";
  public static edgeSize = 0.005;
  public static fontSizeLarge = 1;
  public static fontSizeMedium = 0.7;
  public static fontSizeSmall = 0.4;
  public static maxAnimationSteps = 50;
  public static minLoadingMS = 500;
  public static movedEventName = "-moved";
  public static nodeSizeRatio = 100;
  public static stackSpaceMultiplier = { x: 10, y: 10, z: 10 };
  public static stepsIncrement = 8;
  public static stepsMax: number = 512;
  public static stepsMin: number = 1;
  public static titleIdName = "-title";
  public static topLayerRenderOrder = 999;
  public static unitsDecimalPlaces = 2;
  public static zoomFactor = 2.5;
  public static frustrumScaleFactor = 0.7;

  public static textPadding = {
    width: 0.03,
    height: 0.03
  };

  public static minFrameMS = 15; // Should never be higher than the returned frame time
  public static minTimeForThrottle = Constants.minFrameMS * 5;

  public static buttonColors = {
    active: "#f50057",
    hover: "#f50057",
    up: "#00b0ff"
  };

  public static colors = {
    red: "#f50057",
    blue: "#00b0ff",
    black: "#000000",
    grey: "#222222",
    white: "#ffffff",
    yellow: "#ffeb3b",
    green: "#76ff03",
    lightRed: "#f77777"
  };

  public static lights = {
    ambientLightColor: 0xd0d0d0,
    ambientLightIntensity: 1,
    directionalLight1Color: 0xffffff,
    directionalLight1Intensity: 0.75,
    directionalLight2Color: 0x002958,
    directionalLight2Intensity: 0.5
  };

  public static camera = {
    near: 0.05,
    far: 10000,
    fov: 45,
    minPolarAngle: 5,
    maxPolarAngle: 175,
    rotateSpeed: 0.5,
    zoomSpeed: 1,
    panSpeed: 0.9,
    dampingFactor: 0.25,
    minDistance: 0
  };
}
