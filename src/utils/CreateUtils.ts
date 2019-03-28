import { AlNodeSerial, AlEdgeSerial } from "../interfaces";
import {
  AlGltfModel,
  AlVolumetricModel,
  AlNode,
  AlNodeSpawner,
  AlOrbitControl,
  AlSpinner,
  AlHalo,
  AlFixedToOrbitCamera
} from "../aframe";
import { ThreeUtils, GetUtils } from ".";
import { Constants } from "../Constants";
import { AlEdgeSpawner } from "../aframe/AlEdgeSpawner";

export class CreateUtils {
  static createNode(
    nodes: AlNodeSerial[],
    target: THREE.Vector3,
    position: THREE.Vector3,
    scale: number
  ): AlNodeSerial {
    const id = GetUtils.getNextNodeId(nodes);
    return {
      id: id,
      target: ThreeUtils.vector3ToString(target),
      position: ThreeUtils.vector3ToString(position),
      scale: scale / Constants.nodeSize,
      text: id
    };
  }

  static createEdge(startNode: string, endNode: string): AlEdgeSerial {
    const id = "[" + startNode + "]_[" + endNode + "]";
    return {
      id: id,
      startNode,
      endNode
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
    AFRAME.registerComponent(
      AlEdgeSpawner.getName(),
      AlEdgeSpawner.getObject()
    );
  }
}
