import {
  AlGltfModel,
  AlVolumetricModel,
  AlNode,
  AlNodeSpawner,
  AlOrbitControl,
  AlSpinner,
  AlHalo,
  AlFixedToOrbitCamera,
  AlLookToCamera,
  AlRenderOverlaid,
  AlRenderOverlaidText,
  AlRenderOverlaidLine,
  AlRenderOrder
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
  }
}
