export interface AframeObject {
  schema: {};
  init: () => void;
  onEnterVR: () => void;
  onExitVR: () => void;
  update: (oldData) => void;
  tick: () => void;
  remove: () => void;
  pause: () => void;
  play: () => void;
}
