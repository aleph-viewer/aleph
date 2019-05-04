export class Constants {
  static fontSizeSmall = 0.75;
  static fontSizeMedium = 1.5;
  static fontSizeLarge = 2.5;
  static movedEventName = "-moved";
  static titleIdName = "-title";
  static controllerName = "-controller";
  static nodeSizeRatio = 75;
  static backboardSize = 10;
  static zoomFactor = 2.5;
  static minLoadingMS = 500;
  static topLayerRenderOrder = 999;
  static angleUnitsDecimalPlaces = 3;
  static edgeSize = 0.005;
  static stackSpaceMultiplier = { x: 10, y: 10, z: 10 };
  static maxAnimationSteps = 50;

  static minFrameMS = 15; // Should never be higher than the returned frame time
  static minTimeForThrottle = Constants.minFrameMS * 5;

  static buttonColors = {
    active: "#f50057",
    hover: "#f50057",
    up: "#00b0ff"
  };

  static colorValues = {
    red: "#f50057",
    blue: "#00b0ff",
    black: "#000000",
    white: "#ffffff",
    yellow: "#ffeb3b",
    green: "#76ff03",
    lightRed: "#f77777"
  };

  static lightValues = {
    ambientLightColor: 0xd0d0d0,
    ambientLightIntensity: 1,
    directionalLight1Color: 0xffffff,
    directionalLight1Intensity: 0.75,
    directionalLight2Color: 0x002958,
    directionalLight2Intensity: 0.5
  };

  static cameraValues = {
    near: 0.05,
    far: 10000,
    fov: 45,
    maxPolarAngle: 165,
    rotateSpeed: 0.5,
    zoomSpeed: 1,
    dampingFactor: 0.25,
    minDistance: 0
  };
}
