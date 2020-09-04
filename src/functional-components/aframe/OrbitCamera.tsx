import { FunctionalComponent, h } from "@stencil/core";

interface OrbitCameraProps extends FunctionalComponentProps {
  animating: boolean;
  aspect: number;
  controlPosition: string;
  controlTarget: string;
  dampingFactor: number;
  enabled: boolean;
  far: number;
  fov: number;
  graphEnabled: boolean;
  maxDistance: number;
  maxPolarAngle: number;
  minDistance: number;
  minPolarAngle: number;
  near: number;
  panSpeed: number;
  rotateSpeed: number;
  zoomSpeed: number;
}

export const OrbitCamera: FunctionalComponent<OrbitCameraProps> = (
  {
    animating,
    aspect,
    cb,
    controlPosition,
    controlTarget,
    dampingFactor,
    enabled,
    far,
    fov,
    graphEnabled,
    maxDistance,
    maxPolarAngle,
    minDistance,
    minPolarAngle,
    near,
    panSpeed,
    rotateSpeed,
    zoomSpeed
  },
  _children
) =>
  (() => {
    if (graphEnabled) {
      return (
        <al-a-camera
          fov={fov}
          near={near}
          aspect={aspect}
          look-controls="enabled: false"
          far={far}
          id="mainCamera"
          raycaster="objects: [data-raycastable]"
          al-cursor="rayOrigin: mouse"
          al-orbit-control={`
            minDistance: ${minDistance};
            minPolarAngle: ${minPolarAngle};
            maxDistance: ${maxDistance};
            maxPolarAngle: ${maxPolarAngle};
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
          `}
          al-control-lights
          ref={ref => cb(ref)}
        />
      );
    } else {
      return (
        <al-a-camera
          fov={fov}
          near={near}
          aspect={aspect}
          look-controls="enabled: false"
          far={far}
          id="mainCamera"
          al-orbit-control={`
            minDistance: ${minDistance};
            minPolarAngle: ${minPolarAngle};
            maxDistance: ${maxDistance};
            maxPolarAngle: ${maxPolarAngle};
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
          `}
          al-control-lights
          ref={ref => cb(ref)}
        />
      );
    }
  })();
