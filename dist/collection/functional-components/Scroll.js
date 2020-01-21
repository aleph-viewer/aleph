import { h } from "@stencil/core";
export const Scroll = (props, children) => (h("div", { style: {
        "overflow-y": "auto",
        width: "100%",
        "min-height": "0",
        "max-height": "100%",
        height: props.height
    } }, children));
