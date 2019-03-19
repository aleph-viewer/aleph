import { Tool } from "../interfaces/Tool";
import { GetUtils } from "./GetUtils";
import { ToolType } from "../enums/ToolType";
import { AlGltfModel } from "../aframe/aframe";

export class CreateUtils {
  static createTool(tools: Tool[], type: ToolType): Tool {
    return {
      id: GetUtils.getToolWithHighestId(tools) + 1,
      type: type,
      position: GetUtils.getRandomPosition()
        .toArray()
        .join(" "),
      color: "#8cb7ff",
      selectedColor: "#005cf2"
    };
  }

  static createAframeComponents(): void {
    AFRAME.registerComponent(AlGltfModel.getName(), AlGltfModel.getObject());
  }
}
