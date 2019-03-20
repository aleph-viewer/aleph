import { Tool } from "../interfaces/Tool";
import { GetUtils } from "./GetUtils";
import { ToolType } from "../enums/ToolType";
import {
  AlGltfModel,
  AlVolumetricModel,
  AlTool,
  AlToolSpawner
} from "../aframe/aframe";
import { ThreeUtils } from "./utils";
import { Constants } from "../Constants";

export class CreateUtils {
  static createTool(
    tools: Tool[],
    type: ToolType,
    position: THREE.Vector3,
    scale: number,
    maxMeshDistance: number,
    focusObject: string
  ): Tool {
    return {
      id: GetUtils.getToolWithHighestId(tools) + 1,
      type: type,
      position: ThreeUtils.vector3ToString(position),
      color: Constants.colorValues.blue,
      selectedColor: Constants.colorValues.green,
      scale: scale / Constants.toolSize,
      maxMeshDistance: maxMeshDistance,
      focusObject: focusObject
    };
  }

  static createAframeComponents(): void {
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
  }
}
