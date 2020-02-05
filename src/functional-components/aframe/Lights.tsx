import { FunctionalComponent, h } from "@stencil/core";

interface LightsProps extends FunctionalComponentProps {
  ambientLightColor: number;
  ambientLightIntensity: number;
}

export const Lights: FunctionalComponent<LightsProps> = (
  { ambientLightColor, ambientLightIntensity },
  _children
) => (
  <a-entity
    id="ambient-light"
    light={`type: ambient; color: ${ambientLightColor}; intensity: ${ambientLightIntensity}`}
  />
);
