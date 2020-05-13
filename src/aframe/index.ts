import "./components/al-bounding-box";
import "./components/al-gltf-model";
import "./components/al-node-spawner";
import "./components/AlAngleComponent";
import "./components/AlBackgroundComponent";
import "./components/AlBillboardComponent";
import "./components/AlChildHoverVisibleComponent";
import "./components/AlControlLightsComponent";
import "./components/AlCubeEnvMapComponent";
import "./components/AlCursorComponent";
import "./components/AlEdgeComponent";
import "./components/AlNodeComponent";
import "./components/AlOrbitControlComponent";
import "./components/AlRenderOrderComponent";
import "./components/AlRenderOverlaidComponent";
import "./components/AlTrackballControlComponent";
import "./components/AlVolumeComponent";

export const AlGltfModelEvents = {
  LOADED: "al-model-loaded",
  ERROR: "al-model-error"
}

export const AlNodeEvents = {
  ANIMATION_STARTED: "al-animation-started"
}

export const AlNodeSpawnerEvents = {
  VALID_TARGET: "al-valid-target",
  ADD_NODE: "al-add-node"
}
