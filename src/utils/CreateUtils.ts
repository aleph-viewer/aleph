import { Tool } from "../interfaces/Tool";
import { GetUtils } from "./GetUtils";
import {
  AlGltfModel,
  AlVolumetricModel,
  AlTool,
  AlToolSpawner
} from "../aframe/aframe";
import { ThreeUtils } from "./utils";
import { Constants } from "../Constants";
import { AlOrbitControl } from "../aframe/AlOrbitControl";
import { AlSpinner } from "../aframe/AlSpinner";
import { AlHalo } from "../aframe/AlHalo";

export class CreateUtils {
  static createTool(
    tools: Tool[],
    targetId: string,
    position: THREE.Vector3,
    scale: number
  ): Tool {
    return {
      id: GetUtils.getNextToolId(tools),
      targetId: targetId,
      position: ThreeUtils.vector3ToString(position),
      scale: scale / Constants.toolSize
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
