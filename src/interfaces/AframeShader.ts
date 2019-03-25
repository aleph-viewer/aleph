export interface AframeShader {
  schema: {};
  vertexShader: string;
  fragmentShader: string;
  init: (data?: any) => void;
  update: (oldData) => void;
  tick: () => void;
  remove: () => void;
  pause: () => void;
  play: () => void;
}
