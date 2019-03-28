export interface AframeComponent {
  schema: {};
  init(data?: any): void;
  update(oldData): void;
  tick(): void;
  remove(): void;
}
