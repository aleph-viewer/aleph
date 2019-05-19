import { ComponentDefinition } from "aframe";

export interface BaseComponent extends ComponentDefinition {
  addEventListeners: () => void;
  bindMethods: () => void;
  removeEventListeners: () => void;
}
