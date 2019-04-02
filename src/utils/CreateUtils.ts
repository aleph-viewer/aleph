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
  AlRenderTextOverlaid,
  AlCameraController
} from "../aframe";

export class CreateUtils {
  static createAframeComponents(): void {
    AFRAME.registerShader(AlHalo.getName(), AlHalo.getObject());
    AFRAME.registerGeometry(AlSpinner.getName(), AlSpinner.getObject());
    AFRAME.registerComponent(AlGltfModel.getName(), AlGltfModel.getObject());
    AFRAME.registerComponent(
      AlVolumetricModel.getName(),
      AlVolumetricModel.getObject()
    );
    AFRAME.registerComponent(AlNode.getName(), AlNode.getObject());
    AFRAME.registerComponent(
      AlNodeSpawner.getName(),
      AlNodeSpawner.getObject()
    );
    AFRAME.registerComponent(
      AlOrbitControl.getName(),
      AlOrbitControl.getObject()
    );
    AFRAME.registerComponent(
      AlFixedToOrbitCamera.getName(),
      AlFixedToOrbitCamera.getObject()
    );
    AFRAME.registerComponent(AlEdge.getName(), AlEdge.getObject());
    AFRAME.registerComponent(
      AlLookToCamera.getName(),
      AlLookToCamera.getObject()
    );
    AFRAME.registerComponent(
      AlRenderTextOverlaid.getName(),
      AlRenderTextOverlaid.getObject()
    );
    AFRAME.registerComponent(
      AlCameraController.getName(),
      AlCameraController.getObject()
    );
  }
}
