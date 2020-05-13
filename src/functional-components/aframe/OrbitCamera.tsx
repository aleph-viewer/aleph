import { FunctionalComponent, h } from "@stencil/core";

interface OrbitCameraProps extends FunctionalComponentProps {
  animating: boolean;
  controlPosition: string;
  controlTarget: string;
  dampingFactor: number;
  enabled: boolean;
  far: number;
  fov: number;
  graphEnabled: boolean;
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
    cb,
    controlPosition,
    controlTarget,
    dampingFactor,
    enabled,
    far,
    fov,
    graphEnabled,
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
        <a-camera
          fov={fov}
          near={near}
          look-controls="enabled: false"
          far={far}
          id="mainCamera"
          al-cursor="rayOrigin: mouse"
          raycaster="objects:.collidable;"
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
            animating: ${animating};
            panSpeed: ${panSpeed}
          `}
          al-control-lights
          ref={ref => cb(ref)}
        />
      );
    } else {
      return (
        <a-camera
          fov={fov}
          near={near}
          look-controls="enabled: false"
          far={far}
          id="mainCamera"
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
            animating: ${animating};
            panSpeed: ${panSpeed}
          `}
          al-control-lights
          ref={ref => cb(ref)}
        />
      );
    }
  })();
