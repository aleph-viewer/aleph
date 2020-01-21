import { h } from "@stencil/core";
export const TrackballCamera = ({ animating, cb, controlPosition, controlTarget, dampingFactor, enabled, far, fov, near, panSpeed, rotateSpeed, screenHeight, screenWidth, zoomSpeed }, _children) => (h("a-camera", { fov: fov, near: near, "look-controls": "enabled: false", far: far, id: "mainCamera", "al-cursor": "rayOrigin: mouse", raycaster: "objects: .collidable;", "al-trackball-control": `
      screenLeft: ${0};
      screenTop: ${0};
      screenWidth: ${screenWidth};
      screenHeight: ${screenHeight};
      rotateSpeed: ${rotateSpeed};
      zoomSpeed: ${zoomSpeed};
      panSpeed: ${panSpeed};
      dynamicDampingFactor: ${dampingFactor};
      controlTarget: ${controlTarget};
      controlPosition: ${controlPosition};
      enabled: ${enabled};
      animating: ${animating}
    `, "al-control-lights": true, ref: ref => cb(ref) }));
