import { Tool } from "../interfaces/Tool";
import { GetUtils } from "./GetUtils";
import { AlephGltfModel } from "../aframe/aframe";

export class CreateUtils {

  static createTool(tools: Tool[]): Tool {
    return {
      id: GetUtils.getToolWithHighestId(tools) + 1,
      position: GetUtils.getRandomPosition().toArray().join(" "),
      color: "#8cb7ff",
      selectedColor: "#005cf2"
    };
  }

  static createAframeComponents(): void {
    AFRAME.registerComponent(AlephGltfModel.getName(), AlephGltfModel.getObject());
  }

}
