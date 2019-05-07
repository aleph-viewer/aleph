import {
  PrimitiveDefinition,
  GeometryDefinition,
  ComponentDefinition
} from "aframe";
import {
  AlSpinnerComponent,
  AlNodeComponent,
  AlBoundingBoxComponent,
  AlGltfModelComponent,
  AlVolumeComponent,
  AlNodeSpawnerComponent,
  AlOrbitControlComponent,
  AlFixedToOrbitCameraComponent,
  AlLookToCameraComponent,
  AlRenderOverlaidComponent,
  AlRenderOrderComponent,
  AlEdgeComponent,
  AlAngleComponent
} from "../aframe";

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

  static registerAll() {
    // aframe geometries
    AframeUtils.registerGeometry(
      AlSpinnerComponent.Tag,
      AlSpinnerComponent.Object
    );

    // aframe components
    AframeUtils.registerComponent(AlNodeComponent.Tag, AlNodeComponent.Object);
    AframeUtils.registerComponent(
      AlBoundingBoxComponent.Tag,
      AlBoundingBoxComponent.Object
    );
    AframeUtils.registerComponent(
      AlGltfModelComponent.Tag,
      AlGltfModelComponent.Object
    );
    AframeUtils.registerComponent(
      AlVolumeComponent.Tag,
      AlVolumeComponent.Object
    );
    AframeUtils.registerComponent(
      AlNodeSpawnerComponent.Tag,
      AlNodeSpawnerComponent.Object
    );
    AframeUtils.registerComponent(
      AlOrbitControlComponent.Tag,
      AlOrbitControlComponent.Object
    );
    AframeUtils.registerComponent(
      AlFixedToOrbitCameraComponent.Tag,
      AlFixedToOrbitCameraComponent.Object
    );
    AframeUtils.registerComponent(
      AlLookToCameraComponent.Tag,
      AlLookToCameraComponent.Object
    );
    AframeUtils.registerComponent(
      AlRenderOverlaidComponent.Tag,
      AlRenderOverlaidComponent.Object
    );
    AframeUtils.registerComponent(
      AlRenderOrderComponent.Tag,
      AlRenderOrderComponent.Object
    );
    AframeUtils.registerComponent(AlEdgeComponent.Tag, AlEdgeComponent.Object);
    AframeUtils.registerComponent(
      AlAngleComponent.Tag,
      AlAngleComponent.Object
    );
  }
}
