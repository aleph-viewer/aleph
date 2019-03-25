export interface AframeComponent {
  schema: {};
  init: (data?: any) => void;
  onEnterVR: () => void;
  onExitVR: () => void;
  update: (oldData) => void;
  tick: () => void;
  remove: () => void;
  pause: () => void;
  play: () => void;
}
