import { FunctionalComponent, h } from "@stencil/core";

interface SceneProps extends FunctionalComponentProps {
  isWebGl2: boolean;
  vrToggleEnabled: boolean;
}

export const Scene: FunctionalComponent<SceneProps> = (
  { cb, isWebGl2, vrToggleEnabled },
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
    vr-mode-ui={`
      enabled: ${vrToggleEnabled};
      enterVRButton: #enterVR;
    `}
    ref={ref => cb(ref)}
  >
    {children}
  </a-scene>
);
