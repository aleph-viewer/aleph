import { FunctionalComponent, h } from "@stencil/core";
import { Constants } from "../../Constants";
import { ControlsType } from "../../enums";
import { AlAngle, AlEdge, AlNode } from "../../interfaces";
import { ThreeUtils } from "../../utils";

interface AnglesProps extends FunctionalComponentProps {
  angles: Map<string, AlAngle>;
  boundingSphereRadius: number;
  camera: THREE.Camera;
  cameraPosition: THREE.Vector3;
  controlsType: ControlsType;
  edges: Map<string, AlEdge>;
  edgeMinSize: number;
  edgeSize: number;
  fontSize: number;
  nodes: Map<string, AlNode>;
  selected: string;
}

export const Angles: FunctionalComponent<AnglesProps> = (
  {
    angles,
    boundingSphereRadius,
    camera,
    cameraPosition,
    controlsType,
    edges,
    edgeMinSize,
    edgeSize,
    fontSize,
    nodes,
    selected
  },
  _children
) =>
  (() => {
    return Array.from(angles).map((n: [string, AlAngle]) => {
      const [angleId, angle] = n;
      const edge1 = edges.get(angle.edge1Id);
      const edge2 = edges.get(angle.edge2Id);

      if (edge1 && edge2) {
        let centralNode;
        let node1;
        let node2;
        // IF E1N1 === E2N1
        if (edge1.node1Id === edge2.node1Id) {
          centralNode = nodes.get(edge2.node1Id);
          node1 = nodes.get(edge1.node2Id);
          node2 = nodes.get(edge2.node2Id);
        }
        // IF E1N1 === E2N2
        else if (edge1.node1Id === edge2.node2Id) {
          centralNode = nodes.get(edge2.node2Id);
          node1 = nodes.get(edge1.node2Id);
          node2 = nodes.get(edge2.node1Id);
        }
        // IF E1N2 === E2N1
        else if (edge1.node2Id === edge2.node1Id) {
          centralNode = nodes.get(edge2.node1Id);
          node1 = nodes.get(edge1.node1Id);
          node2 = nodes.get(edge2.node2Id);
        }
        // IF E1N2 === E2N2
        else if (edge1.node2Id === edge2.node2Id) {
          centralNode = nodes.get(edge2.node2Id);
          node1 = nodes.get(edge1.node1Id);
          node2 = nodes.get(edge2.node1Id);
        }
        const radius = ( (boundingSphereRadius * edgeSize) > edgeMinSize ) ? (boundingSphereRadius * edgeSize) : edgeMinSize;
        const node1Pos = ThreeUtils.stringToVector3(node1.position);
        const node2Pos = ThreeUtils.stringToVector3(node2.position);
        const centralPos = ThreeUtils.stringToVector3(centralNode.position);

        const dir1: THREE.Vector3 = node1Pos
          .clone()
          .sub(centralPos)
          .normalize();
        const dir2: THREE.Vector3 = node2Pos
          .clone()
          .sub(centralPos)
          .normalize();
        const angl = dir2.angleTo(dir1);

        // get the edge with the smallest length
        // set the distance from the connecting node to be 20% of the smallest length, unless it exceeds a max
        const smallestLength: number = Math.min(
          centralPos.distanceTo(node1Pos),
          centralPos.distanceTo(node2Pos)
        );

        let distanceFromCentralNode: number = Math.min(
          smallestLength * 0.25,
          radius * 25
        );

        distanceFromCentralNode = Math.max(
          distanceFromCentralNode,
          radius * 10
        );

        const edge1Pos: THREE.Vector3 = dir1
          .clone()
          .multiplyScalar(distanceFromCentralNode);
        const edge2Pos: THREE.Vector3 = dir2
          .clone()
          .multiplyScalar(distanceFromCentralNode);
        const length = edge1Pos.clone().distanceTo(edge2Pos.clone());
        const position: THREE.Vector3 = edge1Pos
          .clone()
          .add(edge2Pos.clone())
          .divideScalar(2);

        const textOffset: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);
        const scale = (node1.scale + node2.scale + centralNode.scale) / 3;
        textOffset.multiplyScalar(scale);

        const degreeNum = THREE.Math.radToDeg(angl).toFixed(Constants.textUnitsDecimalPlaces);
        const textV =
          degreeNum + " " + 
          ( ( parseInt(degreeNum) == 1.0 ) ? "degree" : "degrees"); // todo: use i18n

        const frustrumDistance = ThreeUtils.getFrustrumSpaceDistance(
          camera,
          centralPos.clone(),
          cameraPosition
        );

        const entityScale = 1;

        const textEntityScale =
          (frustrumDistance / boundingSphereRadius) *
          Constants.frustrumScaleFactor;

        return (
          <a-entity al-child-hover-visible id={angleId + "-parent"}>
            <a-entity
              position={ThreeUtils.vector3ToString(centralPos)}
              id={angleId + "-title-anchor"}
              al-billboard={`
              controlsType: ${controlsType};
              cameraPosition: ${ThreeUtils.vector3ToString(camera.position)};
              worldPosition: ${ThreeUtils.vector3ToString(
                centralPos.clone().add(textOffset.clone())
              )};
            `}
            >
              <a-entity
                id={`${angleId}-title`}
                text={`
                  value: ${textV};
                  side: double;
                  align: center;
                  baseline: bottom;
                  anchor: center;
                  width: ${fontSize * boundingSphereRadius};
                  zOffset: ${0.0000001};
                `}
                position={ThreeUtils.vector3ToString(textOffset)}
                visible={`${selected === angleId}`}
                scale={` ${textEntityScale} ${textEntityScale} ${textEntityScale};`}
                al-background={`
                    text: ${textV};
                    boundingRadius: ${fontSize * boundingSphereRadius};
                `}
                al-render-overlaid
              />
            </a-entity>
            <a-entity
              data-raycastable
              id={angleId}
              position={centralNode.position}
              al-angle={`
                selected: ${selected === angleId};
                edge0Pos: ${ThreeUtils.vector3ToString(edge1Pos)};
                edge1Pos: ${ThreeUtils.vector3ToString(edge2Pos)};
                position: ${ThreeUtils.vector3ToString(position)};
                length: ${length};
                radius: ${radius};
                angle: ${angle};
                scale: ${entityScale};
              `}
            />
          </a-entity>
        );
      }
    });
  })();
