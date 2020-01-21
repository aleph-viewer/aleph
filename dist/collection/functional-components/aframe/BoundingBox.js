import { h } from "@stencil/core";
import { DisplayMode } from "../../enums";
import { ThreeUtils, Utils } from "../../utils";
export const BoundingBox = ({ boundingBox, boundingBoxEnabled, cb, color, displayMode, graphEnabled, mesh, srcLoaded, targetEntity }, _children) => (() => {
    if (!srcLoaded) {
        return null;
    }
    else {
        if (!mesh) {
            return null;
        }
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const meshGeom = mesh.geometry;
        let position;
        if (displayMode === DisplayMode.VOLUME) {
            position = targetEntity.object3D.position
                .clone()
                .add(Utils.getGeometryCenter(meshGeom));
            return (h("a-entity", { position: ThreeUtils.vector3ToString(position), "al-bounding-box": `
              scale: ${ThreeUtils.vector3ToString(size)};
              color: ${color};
              enabled: ${boundingBoxEnabled};
            `, "al-node-spawner": `
              graphEnabled: ${graphEnabled};
            `, class: "collidable", ref: ref => cb(ref) }));
        }
        else {
            switch (displayMode) {
                case DisplayMode.MESH: {
                    if (boundingBox.intersectsBox(meshGeom.boundingBox)) {
                        // Check if mesh intersects bounding box; if it does apply the offset
                        const offset = meshGeom.boundingSphere.center.clone();
                        position = targetEntity.object3D.position.clone().add(offset);
                    }
                    else {
                        position = targetEntity.object3D.position.clone();
                    }
                    break;
                }
                case DisplayMode.SLICES: {
                    position = targetEntity.object3D.position
                        .clone()
                        .add(Utils.getGeometryCenter(meshGeom));
                    break;
                }
                default: {
                    break;
                }
            }
            return (h("a-entity", { position: ThreeUtils.vector3ToString(position), "al-bounding-box": `
              scale: ${ThreeUtils.vector3ToString(size)};
              color: ${color};
              enabled: ${boundingBoxEnabled};
            `, ref: ref => cb(ref) }));
        }
    }
})();
