import {
  AlAngle,
  AlEdge,
  AlFixedToOrbitCamera,
  AlGltfModel,
  AlLookToCamera,
  AlNode,
  AlNodeSpawner,
  AlOrbitControl,
  AlRenderOrder,
  AlRenderOverlaid,
  AlRenderOverlaidLine,
  AlRenderOverlaidText,
  AlSpinner,
  AlVolume
} from "../aframe";
import { AframeComponent } from "../interfaces";

export class CreateUtils {
  static geometryExists(tag: string): boolean {
    return !!AFRAME.geometries[tag];
  }

  static componentExists(tag: string): boolean {
    return !!AFRAME.components[tag];
  }

  static registerGeometry(tag: string, obj: AframeComponent): void {
    if (!this.geometryExists(tag)) {
      AFRAME.registerGeometry(tag, obj);
    }
  }

  static registerComponent(tag: string, obj: AframeComponent): void {
    if (!this.componentExists(tag)) {
      AFRAME.registerComponent(tag, obj);
    }
  }

  static createAframeComponents(): void {
    this.registerGeometry(AlSpinner.Tag, AlSpinner.Object);
    this.registerComponent(AlGltfModel.Tag, AlGltfModel.Object);
    this.registerComponent(AlVolume.Tag, AlVolume.Object);
    this.registerComponent(AlNode.Tag, AlNode.Object);
    this.registerComponent(AlNodeSpawner.Tag, AlNodeSpawner.Object);
    this.registerComponent(AlOrbitControl.Tag, AlOrbitControl.Object);
    this.registerComponent(
      AlFixedToOrbitCamera.Tag,
      AlFixedToOrbitCamera.Object
    );
    this.registerComponent(AlLookToCamera.Tag, AlLookToCamera.Object);
    this.registerComponent(AlRenderOverlaid.Tag, AlRenderOverlaid.Object);
    this.registerComponent(
      AlRenderOverlaidText.Tag,
      AlRenderOverlaidText.Object
    );
    this.registerComponent(
      AlRenderOverlaidLine.Tag,
      AlRenderOverlaidLine.Object
    );
    this.registerComponent(AlRenderOrder.Tag, AlRenderOrder.Object);
    this.registerComponent(AlEdge.Tag, AlEdge.Object);
    this.registerComponent(AlAngle.Tag, AlAngle.Object);
  }
}
