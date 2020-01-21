import { h } from "@stencil/core";
import { DisplayMode } from "../../enums";
export const Src = ({ cb, controlsType, displayMode, dracoDecoderPath, graphEnabled, orientation, slicesIndex, src, srcLoaded, volumeSteps, volumeWindowCenter, volumeWindowWidth }, _children) => (() => {
    if (!src) {
        return null;
    }
    else {
        switch (displayMode) {
            case DisplayMode.MESH: {
                return (h("a-entity", { class: "collidable", "al-node-spawner": `
                graphEnabled: ${graphEnabled};
              `, "al-gltf-model": `
                src: url(${src});
                dracoDecoderPath: ${dracoDecoderPath};
              `, position: "0 0 0", scale: "1 1 1", ref: ref => cb(ref) }));
            }
            case DisplayMode.SLICES: {
                return (h("a-entity", { id: "target-entity", class: "collidable", "al-node-spawner": `
                graphEnabled: ${graphEnabled};
              `, "al-volume": `
                controlsType: ${controlsType};
                displayMode: ${displayMode};
                slicesIndex: ${slicesIndex};
                slicesOrientation: ${orientation};
                src: ${src};
                srcLoaded: ${srcLoaded};
                volumeSteps: ${volumeSteps};
                volumeWindowCenter: ${volumeWindowCenter};
                volumeWindowWidth: ${volumeWindowWidth};
              `, position: "0 0 0", ref: ref => cb(ref) }));
            }
            // This is seperate from the slice entity as it will store the volume render,
            // preventing long load times when switching mode
            // Node spawner is on the bounding box in
            // volume mode; as the "volume" is in a different scene
            case DisplayMode.VOLUME: {
                return (h("a-entity", { id: "target-entity", "al-volume": `
                controlsType: ${controlsType};
                displayMode: ${displayMode};
                slicesIndex: ${slicesIndex};
                slicesOrientation: ${orientation};
                src: ${src};
                srcLoaded: ${srcLoaded};
                volumeSteps: ${volumeSteps};
                volumeWindowCenter: ${volumeWindowCenter};
                volumeWindowWidth: ${volumeWindowWidth};
              `, position: "0 0 0", ref: ref => cb(ref) }));
            }
            default: {
                return;
            }
        }
    }
})();
