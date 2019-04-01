import {
  AlGltfModel,
  AlVolumetricModel,
  AlNode,
  AlNodeSpawner,
  AlOrbitControl,
  AlSpinner,
  AlHalo,
  AlFixedToOrbitCamera,
  AlEdge,
  AlLookToCamera,
  AlRenderOverlaid
} from "../aframe";

export class CreateUtils {
  static createAframeComponents(): void {
    AFRAME.registerShader(AlHalo.Tag, AlHalo.Object);
    AFRAME.registerGeometry(AlSpinner.Tag, AlSpinner.Object);
    AFRAME.registerComponent(AlGltfModel.Tag, AlGltfModel.Object);
    AFRAME.registerComponent(AlVolumetricModel.Tag, AlVolumetricModel.Object);
    AFRAME.registerComponent(AlNode.Tag, AlNode.Object);
    AFRAME.registerComponent(AlNodeSpawner.Tag, AlNodeSpawner.Object);
    AFRAME.registerComponent(AlOrbitControl.Tag, AlOrbitControl.Object);
    AFRAME.registerComponent(
      AlFixedToOrbitCamera.Tag,
      AlFixedToOrbitCamera.Object
    );
    AFRAME.registerComponent(AlEdge.Tag, AlEdge.Object);
    AFRAME.registerComponent(AlLookToCamera.Tag, AlLookToCamera.Object);
    AFRAME.registerComponent(AlRenderOverlaid.Tag, AlRenderOverlaid.Object);
  }
}
