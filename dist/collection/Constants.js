export class Constants {
}
Constants.boundingBoxWidth = 2;
Constants.controllerName = "-controller";
Constants.edgeSize = 0.005;
Constants.fontSizeLarge = 1;
Constants.fontSizeMedium = 0.7;
Constants.fontSizeSmall = 0.4;
Constants.frustrumScaleFactor = 0.7;
Constants.lightIntensity = 0.5;
Constants.maxAnimationSteps = 50;
Constants.minLoadingMS = 500;
Constants.movedEventName = "-moved";
Constants.movingStepCount = 2;
Constants.nodeSizeRatio = 100;
Constants.stackSpaceMultiplier = { x: 10, y: 10, z: 10 };
Constants.stepPowerMinMax = [1, 10];
Constants.targetFrameTime = 1000 / 24; // 24 FPS
Constants.titleIdName = "-title";
Constants.topLayerRenderOrder = 999;
Constants.unitsDecimalPlaces = 2;
Constants.zoomFactor = 2.5;
Constants.volumeRaycastSensitivity = 0.05;
Constants.volumeStepsDelay = 800;
Constants.textPadding = {
    width: 0.03,
    height: 0.03
};
Constants.minFrameMS = 15; // Should never be higher than the returned frame time
Constants.minTimeForThrottle = Constants.minFrameMS * 5;
Constants.buttonColors = {
    active: "#f50057",
    hover: "#f50057",
    up: "#00b0ff"
};
Constants.colors = {
    red: "#f50057",
    blue: "#00b0ff",
    black: "#000000",
    grey: "#222222",
    white: "#ffffff",
    yellow: "#ffeb3b",
    green: "#76ff03",
    lightRed: "#f77777"
};
Constants.lights = {
    ambientLightColor: 0xd0d0d0,
    ambientLightIntensity: 1,
    directionalLight1Color: 0xffffff,
    directionalLight1Intensity: 0.75,
    directionalLight2Color: 0x002958,
    directionalLight2Intensity: 0.5
};
Constants.camera = {
    dampingFactor: 0.25,
    far: 10000,
    fov: 45,
    maxPolarAngle: 175,
    minDistance: 0,
    minPolarAngle: 5,
    near: 0.05,
    orbitPanSpeed: 0.3,
    orbitRotateSpeed: 0.5,
    orbitZoomSpeed: 1,
    panSpeed: 0.9,
    trackballRotateSpeed: 2.5,
    trackballZoomSpeed: 5
};
