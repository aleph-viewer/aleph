import { FunctionalComponent, h } from "@stencil/core";
import { Constants } from "../../Constants";
import { ControlsType } from "../../enums";
import { AlNode } from "../../interfaces";
import { ThreeUtils } from "../../utils";

interface NodesProps extends FunctionalComponentProps {
  boundingSphereRadius: number;
  camera: THREE.Camera;
  cameraPosition: THREE.Vector3;
  controlsType: ControlsType;
  fontSize: number;
  graphEnabled: boolean;
  nodes: Map<string, AlNode>;
  nodeLabelsAlwaysVisible: boolean;
  selected: string;
}

export const Nodes: FunctionalComponent<NodesProps> = (
  {
    boundingSphereRadius,
    camera,
    cameraPosition,
    controlsType,
    fontSize,
    graphEnabled,
    nodes,
    nodeLabelsAlwaysVisible,
    selected
  },
  _children
) =>
  (() => {
    return Array.from(nodes).map((n: [string, AlNode]) => {
      const [nodeId, node] = n;
      const frustrumDistance = ThreeUtils.getFrustrumSpaceDistance(
        camera,
        ThreeUtils.stringToVector3(node.position),
        cameraPosition
      );

      // Previous method: scaling nodes relative to view
      // const entityScale =
      //   (frustrumDistance / boundingSphereRadius) *
      //   Constants.frustrumScaleFactor;
      // New method: nodes are consistent (using scale determined by Constants nodeSize)
      const entityScale = 1;

      const textEntityScale =
        (frustrumDistance / boundingSphereRadius) *
        Constants.frustrumScaleFactor;

      const textOffset: THREE.Vector3 = new THREE.Vector3(
        0,
        3 * entityScale,
        0
      );
      textOffset.multiplyScalar(node.scale);

      return (
        <a-entity
          al-child-hover-visible={`nodeLabelsAlwaysVisible: ${nodeLabelsAlwaysVisible ===
            true}`}
          id={nodeId + "-parent"}
        >
          <a-entity
            position={node.position}
            id={nodeId + "-title-anchor"}
            al-billboard={`
              controlsType: ${controlsType};
              cameraPosition: ${ThreeUtils.vector3ToString(camera.position)};
              worldPosition: ${ThreeUtils.vector3ToString(
                ThreeUtils.stringToVector3(node.position).add(
                  textOffset.clone()
                )
              )};
            `}
          >
            <a-entity
              text={`
                value: ${node.title};
                side: double;
                align: center;
                baseline: bottom;
                anchor: center;
                width: ${fontSize * boundingSphereRadius};
                zOffset: ${0.0000001};
              `}
              position={ThreeUtils.vector3ToString(textOffset)}
              al-render-overlaid
              visible={`${selected === nodeId}`}
              id={`${nodeId}-label`}
              al-background={`
                  text: ${node.title};
                  boundingRadius: ${fontSize * boundingSphereRadius};
              `}
              scale={` ${textEntityScale} ${textEntityScale} ${textEntityScale};`}
            />
          </a-entity>
          <a-entity
            data-raycastable
            id={nodeId}
            position={node.position}
            al-node={`
              scale: ${node.scale};
              selected: ${selected === nodeId};
              graphEnabled: ${graphEnabled};
            `}
            scale={` ${entityScale} ${entityScale} ${entityScale};`}
          />
        </a-entity>
      );
    });
  })();
