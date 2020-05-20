import { FunctionalComponent, h } from "@stencil/core";

export const ModelContainer: FunctionalComponent = (_props, children) => (
  <a-entity id="model-container">{children}</a-entity>
);
