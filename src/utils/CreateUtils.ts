import { AlToolSerial } from "../interfaces";
import {
  AlGltfModel,
  AlVolumetricModel,
  AlTool,
  AlToolSpawner,
  AlOrbitControl,
  AlSpinner,
  AlHalo
} from "../aframe";
import { ThreeUtils, GetUtils } from ".";
import { Constants } from "../Constants";

export class CreateUtils {
  static createTool(
    tools: AlToolSerial[],
    target: THREE.Vector3,
    position: THREE.Vector3,
    scale: number
  ): AlToolSerial {
    const id = GetUtils.getNextToolId(tools);
    return {
      id: id,
      target: ThreeUtils.vector3ToString(target),
      position: ThreeUtils.vector3ToString(position),
      scale: scale / Constants.toolSize,
      text: id
    };
  }

  static createAframeComponents(): void {
    AFRAME.registerShader(AlHalo.getName(), AlHalo.getObject());
    AFRAME.registerGeometry(AlSpinner.getName(), AlSpinner.getObject());
    AFRAME.registerComponent(AlGltfModel.getName(), AlGltfModel.getObject());
    AFRAME.registerComponent(
      AlVolumetricModel.getName(),
      AlVolumetricModel.getObject()
    );
    AFRAME.registerComponent(AlTool.getName(), AlTool.getObject());
    AFRAME.registerComponent(
      AlToolSpawner.getName(),
      AlToolSpawner.getObject()
    );
    AFRAME.registerComponent(
      AlOrbitControl.getName(),
      AlOrbitControl.getObject()
    );
  }
}
