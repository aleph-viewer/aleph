export interface AframeObject {
  schema: {};
  init: (data?: any) => void;
  update: () => void;
  tick: () => void;
  remove: () => void;
  pause: () => void;
  play: () => void;
}
