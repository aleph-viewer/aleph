import { FunctionalComponent, h } from "@stencil/core";

interface ScrollProps {
  height: string;
}

export const Scroll: FunctionalComponent<ScrollProps> = (props, children) => (
  <div
    style={{
      "overflow-y": "auto",
      width: "100%",
      "min-height": "0",
      "max-height": "100%",
      height: props.height
    }}
  >
    {children}
  </div>
);
