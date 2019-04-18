import {
  PrimitiveDefinition,
  GeometryDefinition,
  ComponentDefinition
} from "aframe";

export class AframeUtils {
  static primitiveExists(tag: string): boolean {
    return !!AFRAME.primitives[tag];
  }

  static geometryExists(tag: string): boolean {
    return !!AFRAME.geometries[tag];
  }

  static componentExists(tag: string): boolean {
    return !!AFRAME.components[tag];
  }

  static registerPrimitive(tag: string, obj: PrimitiveDefinition): void {
    if (!this.primitiveExists(tag)) {
      AFRAME.registerPrimitive(tag, obj);
    }
  }

  static registerGeometry(tag: string, obj: GeometryDefinition): void {
    if (!this.geometryExists(tag)) {
      AFRAME.registerGeometry(tag, obj);
    }
  }

  static registerComponent(tag: string, obj: ComponentDefinition): void {
    if (!this.componentExists(tag)) {
      AFRAME.registerComponent(tag, obj);
    }
  }
}
