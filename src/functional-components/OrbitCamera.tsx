import { FunctionalComponent, h } from "@stencil/core";

interface OrbitCameraProps {
  animating: boolean;
  controlPosition: string;
  controlTarget: string;
  dampingFactor: number;
  enabled: boolean;
  far: number;
  fov: number;
  maxPolarAngle: number;
  minDistance: number;
  minPolarAngle: number;
  near: number;
  rotateSpeed: number;
  zoomSpeed: number;
}

export const OrbitCamera: FunctionalComponent<OrbitCameraProps> = ({ animating,
  controlPosition,
  controlTarget,
  dampingFactor,
  enabled,
  far,
  fov,
  maxPolarAngle,
  minDistance,
  minPolarAngle,
  near,
  rotateSpeed,
  zoomSpeed }, _children) => (

  <a-camera
    fov={fov}
    near={near}
    look-controls="enabled: false"
    far={far}
    id="mainCamera"
    al-cursor="rayOrigin: mouse"
    raycaster="objects: .collidable;"
    al-orbit-control={`
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
      animating: ${animating}
    `}
    al-control-lights
  />
);
