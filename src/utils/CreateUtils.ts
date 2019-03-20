import { Tool } from "../interfaces/Tool";
import { GetUtils } from "./GetUtils";
import { ToolType } from "../enums/ToolType";
import { AlGltfModel, AlTool, AlToolSpawner } from "../aframe/aframe";
import { ThreeUtils } from "./utils";
import { Constants } from "../Constants";

export class CreateUtils {
  static createTool(
    tools: Tool[],
    type: ToolType,
    position: THREE.Vector3,
    scale: THREE.Vector3
  ): Tool {
    return {
      id: GetUtils.getToolWithHighestId(tools) + 1,
      type: type,
      position: ThreeUtils.vector3ToString(position),
      color: Constants.colorValues.blue,
      selectedColor: Constants.colorValues.red,
      scale: ThreeUtils.vector3ToString(scale.divideScalar(Constants.toolSize))
    };
  }

  static createAframeComponents(): void {
    AFRAME.registerComponent(AlGltfModel.getName(), AlGltfModel.getObject());
    AFRAME.registerComponent(AlTool.getName(), AlTool.getObject());
    AFRAME.registerComponent(
      AlToolSpawner.getName(),
      AlToolSpawner.getObject()
    );
  }
}
