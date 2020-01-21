import { h } from "@stencil/core";
export const OrbitCamera = ({ animating, cb, controlPosition, controlTarget, dampingFactor, enabled, far, fov, maxPolarAngle, minDistance, minPolarAngle, near, panSpeed, rotateSpeed, zoomSpeed }, _children) => (h("a-camera", { fov: fov, near: near, "look-controls": "enabled: false", far: far, id: "mainCamera", "al-cursor": "rayOrigin: mouse", raycaster: "objects: .collidable;", "al-orbit-control": `
      minPolarAngle: ${minPolarAngle};
      maxPolarAngle: ${maxPolarAngle};
      minDistance: ${minDistance};
      screenSpacePanning: true;
      rotateSpeed: ${rotateSpeed};
      zoomSpeed: ${zoomSpeed};
      enableDamping: true;
      dampingFactor: ${dampingFactor};
      controlTarget: ${controlTarget};
      controlPosition: ${controlPosition};
      enabled: ${enabled};
      animating: ${animating};
      panSpeed: ${panSpeed}
    `, "al-control-lights": true, ref: ref => cb(ref) }));
