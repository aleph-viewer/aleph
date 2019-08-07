export interface AframeShader {
  schema: {};
  vertexShader: string;
  fragmentShader: string;
  // tslint:disable-next-line: no-any
  init: (data?: any) => void;
}
