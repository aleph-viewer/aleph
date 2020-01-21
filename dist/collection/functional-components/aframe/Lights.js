import { h } from "@stencil/core";
export const Lights = (_props, _children) => (h("a-entity", { id: "ambient-light", light: "type: ambient; color: #d0d0d0; intensity: 1" }));
