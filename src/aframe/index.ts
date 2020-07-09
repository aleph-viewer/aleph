import "./components/al-angle";
import "./components/al-background";
import "./components/al-billboard";
import "./components/al-bounding-box";
import "./components/al-child-hover-visible";
import "./components/al-control-lights";
import "./components/al-cube-env-map";
import "./components/al-cursor";
import "./components/al-edge";
import "./components/al-gltf-model";
import "./components/al-node";
import "./components/al-node-spawner";
import "./components/al-orbit-control";
import "./components/al-render-order";
import "./components/al-render-overlaid";
import "./components/al-trackball-control";
import "./components/al-volume";
import "./primitives/al-a-camera";

export const AlGltfModelEvents = {
  LOADED: "al-model-loaded",
  ERROR: "al-model-error"
};

export const AlNodeEvents = {
  ANIMATION_STARTED: "al-animation-started"
};

export const AlNodeSpawnerEvents = {
  VALID_TARGET: "al-valid-target",
  ADD_NODE: "al-add-node"
};
