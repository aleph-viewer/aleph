import { FunctionalComponent, h } from "@stencil/core";
import { DisplayMode } from "../../enums";
import { ThreeUtils, Utils } from "../../utils";
type Entity = import("aframe").Entity;

interface BoundingBoxProps extends FunctionalComponentProps {
  boundingBox: THREE.Box3;
  boundingBoxEnabled: boolean;
  color: string;
  displayMode: DisplayMode;
  graphEnabled: boolean;
  mesh: THREE.Mesh;
  srcLoaded: boolean;
  targetEntity: Entity;
}

export const BoundingBox: FunctionalComponent<BoundingBoxProps> = (
  {
    boundingBox,
    boundingBoxEnabled,
    cb,
    color,
    displayMode,
    graphEnabled,
    mesh,
    srcLoaded,
    targetEntity
  },
  _children
) =>
  (() => {
    if (!srcLoaded) {
      return null;
    } else {
      if (!mesh) {
        return null;
      }

      const size: THREE.Vector3 = new THREE.Vector3();
      boundingBox.getSize(size);

      const meshGeom = mesh.geometry;
      let position: THREE.Vector3;

      if (displayMode === DisplayMode.VOLUME) {

        position = targetEntity.object3D.position
          .clone()
          .add(Utils.getGeometryCenter(meshGeom));

        return (
          <a-entity
            position={ThreeUtils.vector3ToString(position)}
            al-bounding-box={`
              scale: ${ThreeUtils.vector3ToString(size)};
              color: ${color};
              enabled: ${boundingBoxEnabled};
            `}
            al-node-spawner={`
              graphEnabled: ${graphEnabled};
            `}
            class="collidable"
            ref={ref => cb(ref)}
          />
        );
      } else if (displayMode === DisplayMode.SLICES) {
        position = targetEntity.object3D.position
          .clone()
          .add(Utils.getGeometryCenter(meshGeom));

        return (
          <a-entity
            position={ThreeUtils.vector3ToString(position)}
            al-bounding-box={`
              scale: ${ThreeUtils.vector3ToString(size)};
              color: ${color};
              enabled: ${boundingBoxEnabled};
            `}
            ref={ref => cb(ref)}
          />
        );
      } else {
        return (
          <a-entity
            al-bounding-box={`
              scale: ${ThreeUtils.vector3ToString(size)};
              color: ${color};
              enabled: ${boundingBoxEnabled};
            `}
            ref={ref => cb(ref)}
          />
        );
      }
    }
  })();
