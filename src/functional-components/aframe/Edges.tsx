import { FunctionalComponent, h } from "@stencil/core";
import { Constants } from "../../Constants";
import { ControlsType, DisplayMode, Units } from "../../enums";
import { AlEdge, AlNode } from "../../interfaces";
import { ThreeUtils } from "../../utils";

interface EdgesProps extends FunctionalComponentProps {
  boundingSphereRadius: number;
  camera: THREE.Camera;
  cameraPosition: THREE.Vector3;
  controlsType: ControlsType;
  displayMode: DisplayMode;
  edges: Map<string, AlEdge>;
  edgeSize: number;
  edgeMinSize: number;
  fontSize: number;
  nodes: Map<string, AlNode>;
  selected: string;
  units: Units;
}

const convertUnits = (
  dist: number,
  displayMode: DisplayMode,
  units: Units
): string => {
  if (displayMode === DisplayMode.MESH) {
    // if in mesh mode, units are always meters by default
    switch (units) {
      case Units.METERS: {
        return dist.toFixed(Constants.textUnitsDecimalPlaces) + " " + units;
      }
      case Units.MILLIMETERS: {
        // convert m to mm
        return (dist / 0.001).toFixed(Constants.textUnitsDecimalPlaces) + " " + units;
      }
      default: {
        break;
      }
    }
  } else {
    // if in volume mode, units are always millimeters by default
    switch (units) {
      case Units.METERS: {
        // convert mm to m
        return (dist / 1000.0).toFixed(Constants.textUnitsDecimalPlaces) + " " + units;
      }
      case Units.MILLIMETERS: {
        return dist.toFixed(Constants.textUnitsDecimalPlaces) + " " + units;
      }
      default: {
        break;
      }
    }
  }
};

export const Edges: FunctionalComponent<EdgesProps> = (
  {
    boundingSphereRadius,
    camera,
    cameraPosition,
    controlsType,
    displayMode,
    edges,
    edgeSize,
    fontSize,
    edgeMinSize,
    nodes,
    selected,
    units
  },
  _children
) =>
  (() => {
    return Array.from(edges).map((n: [string, AlEdge]) => {
      const [edgeId, edge] = n;
      const node1 = nodes.get(edge.node1Id);
      const node2 = nodes.get(edge.node2Id);

      if (node1 && node2) {
        const sv = ThreeUtils.stringToVector3(node1.position);
        const ev = ThreeUtils.stringToVector3(node2.position);

        let dir = ev.clone().sub(sv);
        const dist = dir.length();
        dir = dir.normalize().multiplyScalar(dist * 0.5);
        const centoid = sv.clone().add(dir);

        const textOffset: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);
        const scale = (node1.scale + node2.scale) / 2;
        const radius = ( (boundingSphereRadius * edgeSize) > edgeMinSize ) ? (boundingSphereRadius * edgeSize) : edgeMinSize;
        textOffset.multiplyScalar(scale);

        const textV = convertUnits(dist, displayMode, units);

        const frustrumDistance = ThreeUtils.getFrustrumSpaceDistance(
          camera,
          centoid.clone(),
          cameraPosition
        );

        // Previous method: scaling nodes relative to view
        // const entityScale =
        //   (frustrumDistance / boundingSphereRadius) *
        //   Constants.frustrumScaleFactor;
        // New method: nodes are consistent (using scale determined by Constants edgeSize)
        const entityScale = 1;

        const textEntityScale = (frustrumDistance / boundingSphereRadius) *
          Constants.frustrumScaleFactor;

        return (
          <a-entity al-child-hover-visible id={edgeId + "-parent"}>
            <a-entity
              position={ThreeUtils.vector3ToString(centoid)}
              id={edgeId + "-title-anchor"}
              al-billboard={`
              controlsType: ${controlsType};
              cameraPosition: ${ThreeUtils.vector3ToString(camera.position)};
              worldPosition: ${ThreeUtils.vector3ToString(
                centoid.clone().add(textOffset.clone())
              )};
            `}
            >
              <a-entity
                id={`${edgeId}-title`}
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
                al-render-overlaid
                visible={`${selected === edgeId}`}
                al-background={`
                  text: ${textV};
                  boundingRadius: ${fontSize * boundingSphereRadius};
                `}
                scale={` ${textEntityScale} ${textEntityScale} ${textEntityScale};`}
              />
            </a-entity>
            <a-entity
              data-raycastable
              id={edgeId}
              position={ThreeUtils.vector3ToString(centoid)}
              al-edge={`
                length: ${dist};
                node1: ${node1.position};
                node2: ${node2.position};
                selected: ${selected === edgeId};
                radius: ${radius};
                nodeScale: ${scale};
                scale: ${entityScale};
              `}
            />
          </a-entity>
        );
      }
    });
  })();
