import { FunctionalComponent, h } from "@stencil/core";

interface SceneProps extends FunctionalComponentProps {
  isWebGl2: boolean;
}

export const Scene: FunctionalComponent<SceneProps> = (
  { cb, isWebGl2 },
  children
) => (
  <a-scene
    embedded
    renderer={`
      colorManagement: true;
      sortObjects: true;
      webgl2: ${isWebGl2};
      antialias: true;
    `}
    vr-mode-ui="enabled: false"
    ref={ref => cb(ref)}
  >
    {children}
  </a-scene>
);
