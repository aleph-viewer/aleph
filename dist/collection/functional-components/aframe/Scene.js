import { h } from "@stencil/core";
export const Scene = ({ cb, isWebGl2 }, children) => (h("a-scene", { embedded: true, renderer: `
      colorManagement: true;
      sortObjects: true;
      webgl2: ${isWebGl2};
      antialias: true;
    `, "vr-mode-ui": "enabled: false", ref: ref => cb(ref) }, children));
