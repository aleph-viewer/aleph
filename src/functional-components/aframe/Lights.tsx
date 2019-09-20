import { FunctionalComponent, h } from "@stencil/core";

export const Lights: FunctionalComponent<FunctionalComponentProps> = (
  _props,
  _children
) => (
  <a-entity
    id="ambient-light"
    light="type: ambient; color: #d0d0d0; intensity: 1"
  />
);
