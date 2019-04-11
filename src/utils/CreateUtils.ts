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

export class CreateUtils {
  static createAframeComponents(): void {
    AFRAME.registerGeometry(AlSpinner.Tag, AlSpinner.Object);
    AFRAME.registerComponent(AlGltfModel.Tag, AlGltfModel.Object);
    AFRAME.registerComponent(AlVolume.Tag, AlVolume.Object);
    AFRAME.registerComponent(AlNode.Tag, AlNode.Object);
    AFRAME.registerComponent(AlNodeSpawner.Tag, AlNodeSpawner.Object);
    AFRAME.registerComponent(AlOrbitControl.Tag, AlOrbitControl.Object);
    AFRAME.registerComponent(
      AlFixedToOrbitCamera.Tag,
      AlFixedToOrbitCamera.Object
    );
    AFRAME.registerComponent(AlLookToCamera.Tag, AlLookToCamera.Object);
    AFRAME.registerComponent(AlRenderOverlaid.Tag, AlRenderOverlaid.Object);
    AFRAME.registerComponent(
      AlRenderOverlaidText.Tag,
      AlRenderOverlaidText.Object
    );
    AFRAME.registerComponent(
      AlRenderOverlaidLine.Tag,
      AlRenderOverlaidLine.Object
    );
    AFRAME.registerComponent(AlRenderOrder.Tag, AlRenderOrder.Object);
    AFRAME.registerComponent(AlEdge.Tag, AlEdge.Object);
    AFRAME.registerComponent(AlAngle.Tag, AlAngle.Object);
  }
}
